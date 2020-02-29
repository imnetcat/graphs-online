n1 = 9
n2 = 5
n3 = 0
n4 = 5

nodes = 10 + n3

function [matrix] = getMatrix(nodes, n1, n2, n3, n4)
	n1_str = string(n1);
	n2_str = string(n2);
	n3_str = string(n3);
	n4_str = string(n4);
	n = strcat([ n1_str, n2_str, n3_str, n4_str ]);
	rand("seed", strtod(n));
	T = rand(nodes, nodes) + rand(nodes, nodes);
	matrix = floor((1.0 - n3*0.01 - n4*0.01 - 0.3)*T);
endfunction;

A = getMatrix(nodes, n1, n2, n3, n4);

B = bool2s(A+A')

B
