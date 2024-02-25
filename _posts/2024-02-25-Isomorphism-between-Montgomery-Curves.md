---
title: Isomorphism between Montgomery Curves
subtitle: Efficient Computation of Isomorphism
tags: Mathematics
use_math: true
key: post_20240225
---

* Computing the isomorphism between given two Montgomery curves
* Usefulness of 2-torsion points on Montgomery curves

Implementing [FESTA](https://eprint.iacr.org/2023/660)(Isogeny based PKE), I needed to implement the point evaluation through an isomorphism between given two curves. I looked it up and couldn't find any paper explaining about this. Possibly i'm the only one who couldn't find it. Anyway I decided to derive a proper algorithm for this myself. In this article, I will explain how I did to compute the isomorphism in an efficient way when two distinct Montgomery curves are given as input.

## Isomorphism between two Montgomery curves
To check if two curves are isomorphic, we need to compare its j-invariant. [J-invariant](https://en.wikipedia.org/wiki/J-invariant) is literally a value which is invariant up to isomorphisms. Suppose that we have as input a Montgomery curve below.

<center>
$\begin{aligned}
E_A : y^2 = x^3 + Ax^2 + x \\
\text{ where } A \in \mathbb{F}_{p^2}
\end{aligned}
$</center>

The j-invariant of this curve is known as $j(E) = 8(A^2 - 3)^3/(A^2 - 4) \in \mathbb{F}\_{p^2}$. If we are given another Montgomery curve $E_{A'}$, the condition for the equivalence of these curves is $(A'^2 - 3)^3/(A'^2-4) = (A^2 -3)^3/(A^2 -4)$. Through this equation, we can easily expect that $E_{-A}$ is always isomorphic with $E_{A}$. This form of equivalent curve is called [_twisted curve_](https://en.wikipedia.org/wiki/Twists_of_elliptic_curves) and we already know that the isomorphism is $(x,y) \mapsto (-x,yi) $. However, there are still other equivalent curves than the twisted curve and we need to find the isomorphisms to them. How can we efficiently find the isomorphism between two given equivalent curves?

## Looking at the 2-torsion points
A Montgomery curve always has all three 2-torsion points on the horizontal line $y=0$. One of them is obviously $(0,0)$ which satisfies the curve equation and the other two points satisfy the equation $x^2 + Ax + 1 = 0$(For non-singular cases, we don't need to consider the multiple root). If there is an isomorphism between $E_A$ and $E_{A'}$, the 2-torsion points on $E_A$ are mapped to the 2-torsion points on $E_{A'}$, which is pretty obvious. Since the isomorphism is consisted of scalings and transitions, we can try all scaling and transition functions which maps 2-torsion points to 2-torsion points, which simplifies our problem.

<center>
<figure>
<img src="/assets/20240225/montgomery_curve.png" width="70%">
<img src="/assets/20240225/2-torsion.png" width="70%">
</figure>
</center>

## Finding the isomorphism
We can represent an isomorphism $\phi : E_A \rightarrow E_{A'}$ as a map $(x,y) \mapsto (ux+v, wy)$ where $u, v \neq 0$. By applying this map to the curve equation of $E_A$, we obtain the four equations below and $u, v$ can be represented by $A$ and $A'$. Excluding the twisted curve case, we can get $v \neq 0$.

<center>
$
\begin{aligned}
E_{A'}(ux+v, wy) : w^2y^2 &= (ux+v)^3 + A'(ux+v)^2 + (ux+v) \cong E_{A} \\
\Leftrightarrow v^2 + A'v + 1 &= 0\\
u^3 &= w^2 \\
3v + A' &= uA \\
v^2 - 1 &= u^2
\end{aligned}
$
</center>

These four equations are reduced to $v = \frac{A'^2 + 2A^2 - 9}{A'(3 - A^2)}$ and $u = \frac{3v + A'}{A}$. Note that we cannot determine $w$ uniquely but this isn't any matter for us to compute corresponding kernel group instead of the specific point. In practice we only use points on the _Kummer line_ instead of the points on the real curve even when we calculate an isogeny.

## Implementation
Using [Rust](https://www.rust-lang.org/), you can implement above equation as follows :
```rust
#[derive(Clone)]
pub struct CurveIsomorphism {
    u: Fq,
    v: Fq,
    w: Fq,
}

impl CurveIsomorphism {
    pub fn new(domain: &Curve, codomain: &Curve) -> Self {
        debug_assert_eq!(
            domain.j_invariant(),
            codomain.j_invariant(),
            "Given curves are not isomorphic!"
        );
        let (A2, A1) = (domain.get_constant(), codomain.get_constant());
        let v = (A1.square() + A2.square().mul2() - Fq::THREE.square())
            / (A1 * (Fq::THREE - A2.square()));
        let u = (Fq::THREE * v + A1) / A2;
        let w = (u * u.square()).sqrt().0;
        CurveIsomorphism { u, v, w }
    }

    pub fn eval(&self, P: &Point) -> Point {
        let (Px, Py) = P.to_xy();
        let imP = Point::new_xy(&(self.u * Px + self.v), &(self.w * Py));
        imP
    }
}
```
The entire source code is available at my [festa_rs github](https://github.com/gusgkr0117/festa_rs)