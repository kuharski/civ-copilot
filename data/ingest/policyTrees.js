import PolicyTree from "../../models/PolicyTree.js";
import buildUrl from "../utils/buildUrl.js";
import fetchJson from "../utils/fetchJson.js";

export default async function ingestPolicyTrees() {

    try {
        console.log("ingesting policy trees")
        const policiesUrl = buildUrl("policies", "policies");
        const policies = await fetchJson(policiesUrl);
        
        const treeMap = new Map();

        for (const policy of policies) {
            const tree = policy.branch; // tree portion
            if (tree && !treeMap.has(tree.name)) {
                treeMap.set(tree.name, {
                name: tree.name,
                info: tree.game_info,
                prereqEra: tree.prereq_era,
                icon: policy.icon, // icon from one random policy
                isIdeology: ["Freedom", "Order", "Autocracy"].includes(tree.name)
            });
            }    
        }

        for (const tree of treeMap.values()) {
            await PolicyTree.updateOne({"name": tree.name}, {$set: tree}, {upsert: true});
            //console.log(`ingested ${tree.name}`);
        }

    } catch (err){
        console.error("error in ingestPolicyTrees: ", err);
    }
}
