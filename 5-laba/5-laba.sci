n1 = 9
n2 = 5
n3 = 0
n4 = 5

n = 10 + n3

n1_str = string(n1);
n2_str = string(n2);
n3_str = string(n3);
n4_str = string(n4);
nn = strcat([ n1_str, n2_str, n3_str, n4_str ]);
rand("seed", strtod(nn));
T = rand(n, n) + rand(n, n);
A = floor((1.0 - n3*0.01 - n4*0.005 - 0.05)*T);


Wt = round(rand(n,n)*100 .* A);
B = Wt & ones(n,n);
Wt = (bool2s(B & ~B') + bool2s(B & B') .* tril(ones(n,n),-1)) .* Wt;
W = Wt + Wt';
A
W
