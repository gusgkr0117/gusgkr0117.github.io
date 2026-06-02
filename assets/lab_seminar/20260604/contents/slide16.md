# Cubic Equation from Theta Functions

Start with the degree $3$ theta basis:
$$
s_k(z)=
\sum_{n\in\mathbb Z}
\exp\left(
3\pi i(n+k/3)^2\tau
+6\pi i(n+k/3)z
\right),
\quad k=0,1,2.
$$

These give projective coordinates:
$$
[X_0:X_1:X_2]
=
[s_0(z):s_1(z):s_2(z)].
$$

Now look at cubic expressions in $X_0,X_1,X_2$:
$$
X_0^3,\ X_0^2X_1,\ \ldots,\ X_2^3.
$$

There are $10$ such monomials.
But each one is a degree $9$ theta section, and
$$
\dim H^0(E,L^{\otimes 3})=9.
$$

So the $10$ cubic expressions must satisfy one linear relation:
$$
\sum_{i+j+k=3}
a_{ijk}(\tau)X_0^iX_1^jX_2^k=0.
$$

A symmetric theta basis means that the $3$-torsion symmetries of the torus act on the coordinates in the standard way:
$$
(X_0,X_1,X_2)\mapsto (X_1,X_2,X_0),
$$
and
$$
(X_0,X_1,X_2)\mapsto (X_0,\zeta X_1,\zeta^2X_2),
\qquad \zeta^3=1.
$$

The cubic relation must be invariant under these symmetries.
The diagonal symmetry leaves only
$$
X_0^3,\quad X_1^3,\quad X_2^3,\quad X_0X_1X_2.
$$

The cyclic symmetry forces the coefficients of $X_0^3,X_1^3,X_2^3$ to be equal.
Thus the relation has the form
$$
A(\tau)(X_0^3+X_1^3+X_2^3)+B(\tau)X_0X_1X_2=0.
$$

After rescaling, this becomes the Hesse cubic:
$$
X_0^3+X_1^3+X_2^3
-3\lambda(\tau)X_0X_1X_2=0.
$$

The coefficient is determined by theta constants.
For example, evaluating at $z=0$ gives
$$
\lambda(\tau)
=
\frac{s_0(0)^3+s_1(0)^3+s_2(0)^3}
{3s_0(0)s_1(0)s_2(0)}.
$$
