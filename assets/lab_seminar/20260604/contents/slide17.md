# From Cubic Equation to Weierstrass Form

Start from the Hesse cubic:
$$
C_\lambda:\quad
X_0^3+X_1^3+X_2^3
-3\lambda X_0X_1X_2=0.
$$

Choose a flex point as the origin:
$$
O=[1:-1:0].
$$

The tangent line at $O$ is
$$
X_0+X_1+\lambda X_2=0.
$$

Now choose new projective coordinates so that
$$
O=[0:1:0],
\qquad
\text{tangent line at }O=\{Z=0\}.
$$

One convenient choice is
$$
X=X_2,\qquad
Y=X_0,\qquad
Z=X_0+X_1+\lambda X_2.
$$

Equivalently,
$$
X_0=Y,\qquad
X_2=X,\qquad
X_1=Z-Y-\lambda X.
$$

Substitute this into the Hesse equation:
$$
Y^3+(Z-Y-\lambda X)^3+X^3
-3\lambda Y(Z-Y-\lambda X)X=0.
$$

Because $O=[0:1:0]$ is now the point at infinity and $Z=0$ is its tangent line, this cubic can be written in generalized Weierstrass form:
$$
Y^2Z+a_1XYZ+a_3YZ^2
=
X^3+a_2X^2Z+a_4XZ^2+a_6Z^3.
$$

The coefficients $a_i$ are functions of $\lambda$, hence functions of $\tau$.

On the affine chart $Z=1$, this is
$$
y^2+a_1xy+a_3y
=
x^3+a_2x^2+a_4x+a_6.
$$

Complete the square:
$$
y^{\prime} = y+\frac{a_1x+a_3}{2}.
$$

Then shift $x$ to remove the $x^2$ term:
$$
x^{\prime} = x+\frac{a_2+a_1^2/4}{3}.
$$

This gives
$$
(y^{\prime})^2=(x^{\prime})^3+A(\tau)x^{\prime}+B(\tau).
$$

After homogenizing and rescaling $Y$, we get the short Weierstrass form:
$$
Y^2Z=4X^3-g_2(\tau)XZ^2-g_3(\tau)Z^3.
$$

Thus the path is:
$$
\text{Hesse cubic from theta}
\longrightarrow
\text{choose origin and tangent}
\longrightarrow
\text{Weierstrass form}.
$$
