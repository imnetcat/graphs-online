clf
n1 = 9
n2 = 5
n3 = 0
n4 = 5

plot_x = 200
plot_y = 200
plot_x_offfset = 10
plot_y_offfset = 10

nodes_spacing = 20
nodes_diameter = 20

nodes = 10 + n3

function [matrix] = getMatrix(nodes, n1, n2, n3, n4)
	n1_str = string(n1);
	n2_str = string(n2);
	n3_str = string(n3);
	n4_str = string(n4);
	n = strcat([ n1_str, n2_str, n3_str, n4_str ]);
	rand("seed", strtod(n));
	T = rand(nodes, nodes) + rand(nodes, nodes);
	matrix = floor((1.0 - n3*0.02 - n4*0.005 - 0.25)*T);
endfunction;

function showPlot(x, y)
	plot2d([0;x], [0;y], 0);
endfunction

function showNodes(nodes_diameter, nodes_spacing, plot_x, plot_y, plot_x_offfset, plot_y_offfset)
    xarc((plot_x/2)+plot_x_offfset, plot_y-plot_y_offfset, nodes_diameter, nodes_diameter, 0, 360*64);
    
    xarc((plot_x/2)-nodes_spacing+plot_x_offfset, plot_y-nodes_spacing*2-plot_y_offfset, nodes_diameter, nodes_diameter, 0, 360*64);
    xarc((plot_x/2)+nodes_spacing+plot_x_offfset, plot_y-nodes_spacing*2-plot_y_offfset, nodes_diameter, nodes_diameter, 0, 360*64);
    
    xarc((plot_x/2)+plot_x_offfset, plot_y-nodes_spacing*4-plot_y_offfset, nodes_diameter, nodes_diameter, 0, 360*64);
    xarc((plot_x/2)+nodes_spacing*2+plot_x_offfset, plot_y-nodes_spacing*4-plot_y_offfset, nodes_diameter, nodes_diameter, 0, 360*64);
    xarc((plot_x/2)-nodes_spacing*2+plot_x_offfset, plot_y-nodes_spacing*4-plot_y_offfset, nodes_diameter, nodes_diameter, 0, 360*64);
    
    xarc((plot_x/2)-nodes_spacing*3+plot_x_offfset, plot_y-nodes_spacing*6-plot_y_offfset, nodes_diameter, nodes_diameter, 0, 360*64);
    xarc((plot_x/2)-nodes_spacing+plot_x_offfset, plot_y-nodes_spacing*6-plot_y_offfset, nodes_diameter, nodes_diameter, 0, 360*64);
    xarc((plot_x/2)+nodes_spacing+plot_x_offfset, plot_y-nodes_spacing*6-plot_y_offfset, nodes_diameter, nodes_diameter, 0, 360*64);
    xarc((plot_x/2)+nodes_spacing*3+plot_x_offfset, plot_y-nodes_spacing*6-plot_y_offfset, nodes_diameter, nodes_diameter, 0, 360*64);
endfunction;

function showNumbers(nodes_diameter, nodes_spacing, plot_x, plot_y, plot_x_offfset, plot_y_offfset)
    xnumb((plot_x/2)+plot_x_offfset+nodes_diameter/2.5, plot_y-plot_y_offfset-nodes_diameter/1.5, 1);
    
    xnumb((plot_x/2)-nodes_spacing+plot_x_offfset+nodes_diameter/2.5, plot_y-nodes_spacing*2-plot_y_offfset-nodes_diameter/1.5, 2);
    xnumb((plot_x/2)+nodes_spacing+plot_x_offfset+nodes_diameter/2.5, plot_y-nodes_spacing*2-plot_y_offfset-nodes_diameter/1.5, 3);
    
    xnumb((plot_x/2)+plot_x_offfset+nodes_diameter/2.5, plot_y-nodes_spacing*4-plot_y_offfset-nodes_diameter/1.5, 4);
    xnumb((plot_x/2)+nodes_spacing*2+plot_x_offfset+nodes_diameter/2.5, plot_y-nodes_spacing*4-plot_y_offfset-nodes_diameter/1.5, 5);
    xnumb((plot_x/2)-nodes_spacing*2+plot_x_offfset+nodes_diameter/2.5, plot_y-nodes_spacing*4-plot_y_offfset-nodes_diameter/1.5, 6);
    
    xnumb((plot_x/2)-nodes_spacing*3+plot_x_offfset+nodes_diameter/2.5, plot_y-nodes_spacing*6-plot_y_offfset-nodes_diameter/1.5, 7);
    xnumb((plot_x/2)-nodes_spacing+plot_x_offfset+nodes_diameter/2.5, plot_y-nodes_spacing*6-plot_y_offfset-nodes_diameter/1.5, 8);
    xnumb((plot_x/2)+nodes_spacing+plot_x_offfset+nodes_diameter/2.5, plot_y-nodes_spacing*6-plot_y_offfset-nodes_diameter/1.5, 9);
    xnumb((plot_x/2)+nodes_spacing*3+plot_x_offfset+nodes_diameter/2.5, plot_y-nodes_spacing*6-plot_y_offfset-nodes_diameter/1.5, 10);
endfunction;

function showArrows(nodes_diameter, nodes_spacing, plot_x, plot_y, plot_x_offfset, plot_y_offfset)
    xarrows([(plot_x/2)+nodes_spacing+plot_x_offfset;(plot_x/2)+plot_x_offfset], [(plot_x/2)+plot_x_offfset;plot_y-nodes_spacing*1.5-plot_y_offfset], 50, 1);
endfunction;


A = getMatrix(nodes, n1, n2, n3, n4);

showPlot(plot_x, plot_y);

showNodes(nodes_diameter, nodes_spacing, plot_x, plot_y, plot_x_offfset, plot_y_offfset);

showNumbers(nodes_diameter, nodes_spacing, plot_x, plot_y, plot_x_offfset, plot_y_offfset);

showArrows(nodes_diameter, nodes_spacing, plot_x, plot_y, plot_x_offfset, plot_y_offfset);

//xarrows([12;48], [20;20], 50, 2);
