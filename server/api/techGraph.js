import Tech from "../models/Tech.js";

export default class techGraph {
    
     /**
     * creates a new techGraph instance.
     * @param {techGraph|null} [sourceGraph=null] - copy from another techGraph 
     */
    constructor(sourceGraph = null) { 
        this.graph = new Map();

        if(sourceGraph) {
            for (const [key, val] of sourceGraph.graph) {
                this.graph.set(key, structuredClone(val));
            }
        }
    }

     /**
     * initializes the graph from MongoDB Tech collection
     * populates the graph with tech nodes
     * @returns {Promise<void>}
     */
    async init() {

        const techs = await Tech.find({}).lean();

        techs.forEach((tech) => {
            this.graph.set(tech.name, {
                name: tech.name,
                era: tech.era,
                cost: tech.cost,
                icon: tech.icon,
                prereqs: tech.prereqTechs,
                postreqs: tech.techUnlocks,
                units: tech.unitUnlocks,
                buildings: tech.buildingUnlocks,
                weight: -1,
                priority: -1
            });
        });
    }

    getCost(tech) {
        return this.graph?.get(tech).cost;
    }

    /**
     * creates a subgraph after removing specified nodes and applying a cost cap
     * 
     * @param {techGraph} prevGraph - the original graph to copy from
     * @param {string[]} trimNodes - list of node keys to remove explicitly
     * @param {number} costCap - maximum allowed cost for nodes to keep
     * @returns {techGraph} a new candidate subgraph
     * @throws {Error} if a trim node is not found in the graph
     */
    static candidateSubgraph(prevGraph, trimNodes, costCap) { 

        const candidates = new techGraph(prevGraph); // copy

        //delete required trim nodes
        trimNodes.forEach((key) => {
            if(!candidates.graph.delete(key)) {throw new Error(`invalid trim node ${key} for candidate graph`);}

        });

        // delete above cost cap nodes
        for (const [key, node] of candidates.graph) {
            if(node.cost > costCap) {
                candidates.graph.delete(key);
            }
        }

        // remove references to deleted nodes
        for (const [key, node] of candidates.graph) {
            if(node?.postreqs && node.postreqs.length > 0) {
                node.postreqs = node.postreqs.filter(key => candidates.graph.has(key));
            }
            if(node?.prereqs && node.prereqs.length > 0) {
                node.prereqs = node.prereqs.filter(key => candidates.graph.has(key));
            }
        }

        return candidates;
    }

    /**
     * recursively builds an ancestor subgraph from a blueprint graph
     * @private
     * @param {techGraph} bluePrint - source graph to traverse
     * @param {techGraph} creation - graph being built
     * @param {string} start - starting node key
     */
    static #buildAncestorGraph(bluePrint, creation, start) {

        const node = bluePrint.graph.get(start);

        if(node?.prereqs && node.prereqs.length > 0) { // has prereqs
            node.prereqs.forEach((parent) => {
                this.#buildAncestorGraph(bluePrint, creation, parent);
            });
        }

        creation.graph.set(start, node);
    }

    /**
     * creates a subgraph containing all ancestors of given target nodes
     * 
     * @param {techGraph} candidates - source graph to extract ancestors from
     * @param {string[]} targetNodes - list of target node keys
     * @returns {techGraph} the ancestor subgraph
     * @throws {Error} if a target node is not found
     */
    static ancestorSubgraph(candidates, targetNodes) {

        // blank new graph
        const ancestor = new techGraph();

        targetNodes.forEach((key) => {
            if(!candidates.graph.has(key)){
                throw new Error(`cannot find target node ${key} in candidate graph`);
            }
        });

        targetNodes.forEach((key) => {
            this.#buildAncestorGraph(candidates, ancestor, key);
        });

        return ancestor;
    }
}
