import React from 'react';
import { ConstellationWrap } from './styles';

const ConstellationSVG: React.FC = () => {
  const nodes = [
    {cx:110,cy:80,r:5,delay:0},{cx:50,cy:50,r:4,delay:.3},{cx:170,cy:55,r:4,delay:.6},
    {cx:40,cy:120,r:3,delay:.9},{cx:185,cy:115,r:3,delay:1.2},{cx:110,cy:140,r:4,delay:1.5},
    {cx:80,cy:100,r:3,delay:.5},{cx:145,cy:95,r:3,delay:.8},
  ];
  const edges = [[0,1],[0,2],[0,6],[0,7],[1,3],[2,4],[0,5],[6,3],[7,4],[5,3],[5,4]];
  return (
    <svg width="220" height="160" viewBox="0 0 220 160" style={{overflow:'visible'}}>
      <defs>
        <radialGradient id="ng2"><stop offset="0%" stopColor="#c4b5fd"/><stop offset="100%" stopColor="#7c3aed"/></radialGradient>
        <filter id="gl2"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      {edges.map(([a,b],i)=>{
        const na=nodes[a],nb=nodes[b],len=Math.hypot(nb.cx-na.cx,nb.cy-na.cy);
        return <line key={i} x1={na.cx} y1={na.cy} x2={nb.cx} y2={nb.cy}
          stroke="rgba(167,139,250,.4)" strokeWidth="1" strokeDasharray={len} strokeDashoffset={len}
          style={{animation:`planLine2 0.6s cubic-bezier(.4,0,.2,1) ${(nodes[a].delay+.2).toFixed(1)}s forwards`}}/>;
      })}
      {nodes.map((n,i)=><circle key={i} cx={n.cx} cy={n.cy} r={n.r} fill="url(#ng2)" filter="url(#gl2)"
        style={{opacity:0,animation:`planNode2 0.5s cubic-bezier(.34,1.56,.64,1) ${n.delay}s forwards`}}/>)}
      <style>{`
        @keyframes planNode2{0%{opacity:0;transform:scale(0)}60%{opacity:1;transform:scale(1.2)}100%{opacity:1;transform:scale(1)}}
        @keyframes planLine2{from{stroke-dashoffset:var(--len,120);opacity:0}to{stroke-dashoffset:0;opacity:.5}}
      `}</style>
    </svg>
  );
};

const Constellation: React.FC = () => {
    return (
        <ConstellationWrap>
            <ConstellationSVG />
        </ConstellationWrap>
    );
};

export default Constellation;
