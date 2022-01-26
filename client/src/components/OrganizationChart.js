import React, { useLayoutEffect, useRef, useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import { OrgChart } from 'd3-org-chart';
import { Button } from 'primereact/button';

let compact = 0;

const Cards = d => {
  console.log('d', d);
  return (
    <div style={{ paddingTop: 30, backgroundColor: 'none', marginLeft: '1px', height: d.height, borderRadius: 2, overflow: 'visible' }}>
      <div style={{ height: d.height - 32, paddingTop: '0px', backgroundColor: 'white', border: '1px solid lightgray' }}>
        <div style={{ marginRight: '10px', marginTop: '15px', float: 'right'}}>{d.data.data.key}</div>
        <div style={{ backgroundColor: '#3AB6E3', height: '10px', width: d.width - 2, borderRadius: '1px' }}></div>
        <div style={{ padding: '20px', paddingTop: '35px'}}>
            <div style={{ color: '#111672', fontSize: '12px', fontWeight: 'bold' }}>
              {d.data.data.type === 'sprint' ? d.data.data.label : ''}
              {d.data.data.type === 'epic' ? d.data.data.name : ''}
              {d.data.data.type === 'issue' ? d.data.data?.fields?.summary : ''}
            </div>
            <div style={{ color: '#404040',fontSize: '10px', marginTop: '4px' }}>{d.data.data?.fields?.assignee?.displayName}</div>
        </div>
      </div>
    </div>
  );
}

export const OrganizationChart = (props, ref) => {
  const d3Container = useRef(null);
  let chart = null;

  function addNode(node) {
    chart.addNode(node);
  }

  props.setClick(addNode);

  useEffect(() => {
    window.addEventListener('resize', () => chart.fit());
  }, [chart]);

  // We need to manipulate DOM
  useLayoutEffect(() => {
    if (props.data && d3Container.current) {
      if (!chart) {
        chart = new OrgChart();
      }

      chart
        .container(d3Container.current)
        .data(props.data)
        .nodeWidth((d) => 250)
        .initialZoom(1)
        .nodeHeight((d) => 175)
        .childrenMargin((d) => 40)
        .compact(false)
        .compactMarginBetween((d) => 65)
        .compactMarginPair((d) => 100)
        .nodeContent((d, i, arr, state) => {
          return ReactDOMServer.renderToString(Cards(d));
        })
        .onNodeClick((d, i, arr) => {
          console.log(d, 'Id of clicked node ');
          props.onNodeClick(d);
        })
        .render();
        chart.expandAll();
        // chart.compact(!!(compact++%2)).render().fit();
    }
  }, [props.data, d3Container.current]);

  return (
    <>
      <div ref={d3Container} />
      <div style={{ position: 'absolute', bottom: 40, right: 40, backgroundColor: 'gray' }}>
        <Button onClick={() => chart.zoomOut()}>-</Button>
        <Button onClick={() => chart.zoomIn()}>+</Button>
      </div>
    </>
  );
};
