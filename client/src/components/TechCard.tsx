import { Handle, Position } from 'reactflow';

export default function TechNode({ data }: { data: { name: string; cost: string; icon: string; selected?: boolean; ranked?: number; target?: boolean } }) {
  return (
    <div className={`bg-background relative cursor-pointer text-white p-4 rounded-xl shadow-lg w-[190px] flex flex-col items-center 
        ${data.selected 
          ? 'border-[6px] border-[#5b9bd5]'
          : data.target
          ? 'border-[6px] border-[#58ca52]'
          : data.ranked !== -1
          ? 'border-[6px] border-[#cab852]'
          :''}`}>
      <Handle type="target" position={Position.Left} isConnectable={false} style={{ pointerEvents: 'none', opacity: 0 }}/>
      {data.ranked !== -1 && (
        <div className="absolute top-3 right-3 w-10 h-10 flex items-center font-mono justify-center border-2 border-white bg-transparent text-white font-bold text-xl rounded-full">
          {data.ranked}
        </div>
      )}
      { data.name === "Engineering" ?
        (<img src={"/icons/engineering.png"} alt=""  className="w-10 h-10 mb-1" />) :
        (<img src={data.icon} alt="" className="w-10 h-10 mb-1" />)
      }
      <div className="text-base font-bold text-center">{data.name}</div>
      <div className="text-sm text-gray-300">Cost: {data.cost}</div>
      <Handle type="source" position={Position.Right} isConnectable={false} style={{ pointerEvents: 'none', opacity: 0 }}/>
    </div>
  );
}