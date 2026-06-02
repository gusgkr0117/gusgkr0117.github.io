# Addition After Projective Embedding

On the complex torus, the group operation is simple:
$$
z_1+z_2 \quad \text{mod } \Lambda .
$$

The projective embedding is made from three theta sections:
$$
\phi(z)=[s_0(z):s_1(z):s_2(z)].
$$

Let
$$
P=\phi(z_1),\qquad Q=\phi(z_2).
$$

A line in $\mathbb P^2$ has equation
$$
aX_0+bX_1+cX_2=0.
$$

Pull this line back through the embedding.
Then we get a theta section
$$
F(z)=as_0(z)+bs_1(z)+cs_2(z).
$$

So saying that the line passes through $P$ and $Q$ means
$$
F(z_1)=0,\qquad F(z_2)=0.
$$

Since $F$ is a section of a degree $3$ line bundle, it has three zeros on the torus:
$$
z_1,\quad z_2,\quad z_3.
$$

Why does the sum of zeros appear?
Here $\vartheta$ is an auxiliary degree $1$ theta factor, not one of the degree $3$ basis sections $s_0,s_1,s_2$.
It satisfies
$$
\vartheta(z+\tau)
=
-e^{-\pi i\tau-2\pi iz}\vartheta(z).
$$

If a degree $3$ theta section has zeros $z_1,z_2,z_3$, then locally it behaves like
$$
F(z)\sim
\vartheta(z-z_1)\vartheta(z-z_2)\vartheta(z-z_3).
$$

After translating by $\tau$, this product picks up the factor
$$
e^{-3\pi i\tau-6\pi iz}
\cdot
e^{2\pi i(z_1+z_2+z_3)}.
$$

But the line bundle already fixes the allowed transformation factor of a degree $3$ section.
The basis sections themselves satisfy
$$
s_k(z+\tau)=e^{-3\pi i\tau-6\pi iz}s_k(z),
\qquad k=0,1,2.
$$
So any linear combination
$$
F(z)=a_0s_0(z)+a_1s_1(z)+a_2s_2(z)
$$
must have the same factor.

Therefore the extra term
$$
e^{2\pi i(z_1+z_2+z_3)}
$$
must be fixed.

After choosing the origin used in the embedding, this fixed value is normalized to $1$.
So the three zeros satisfy
$$
z_1+z_2+z_3=0
\quad \text{in } \mathbb C/\Lambda
$$

Therefore
$$
z_3=-(z_1+z_2).
$$

Geometrically, $\phi(z_3)$ is the third intersection point of the line with the cubic.

Thus the embedded group law is:
$$
\phi(z_1+z_2)
=
\text{inverse of the third intersection}.
$$

In Weierstrass coordinates, inverse means
$$
(x,y)\mapsto (x,-y).
$$
