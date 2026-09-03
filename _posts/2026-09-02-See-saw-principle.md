---
title: See-saw principle
subtitle: See-saw principle 이해하기
tags: Mathematics Abelian_Variety
use_math: true
key: post_20260902
---

+ See-saw principle은 theorem of the cube를 증명하는데 사용된다.

# Definitions and theorems
## Completeness
**Complete** algebraic variety $X$는 어떤 variety $Y$에 대해서도
projection morphism

<center>
$
    p : X \times Y \to Y
$
</center>

이 closed set을 closed set으로 보내는 closed map임을 의미한다.

Variety $X$ 위의 rank 1 free sheaf $\mathcal{L}$을 $X$ 위의 line bundle이라고 한다.

## Cohomology and base change theorem
$X$와 $Y$가 scheme이라고 하자. $Y$는 locally Noetherian & reduced scheme이라고 하자.

$f : X \to Y$가 proper한 morphism이라고 하자.

$L$은 $X$위의 coherent sheaf이고, $Y$위에서 flat하다고 하자.

각 $y \in Y$에 대해서 global section들의 dimension

<center>
$
    h^0(y, L) := \mathrm{dim}_{k(y)}H^0(Y_y, L_y)
$
</center>

를 생각할때, 이 값이 항상 $r$로 동일하다면, $f\_{\ast}L$은
$Y$위의 locally free sheaf of rank $r$이고, $y \in Y$에 대해
base-change map

<center>
$
    (f_{\ast}L)\otimes_{\mathcal{O}_y} k(y) \to H^0(Y_y, L_y)
$
</center>

는 isomorphism이다.

## Nakayama lemma
$A$를 local ring이라 하고 $\mathfrak{m}$을 $A$의 maximal ideal, $M$을 finitely generated $A$-module이라고 하자.

<center>
$ 
    M/\mathfrak{m} = M
$
</center>

이면, $M = 0$이다.


$A$-module $N,M$에 대해서 어떤 morphism $f: N \to M$이 존재할때,
<center>
$
    f \otimes_A k: N \otimes_A k \to M \otimes_A k
$
</center>
는 surjective라면, cokernel $N/M \otimes\_A k = 0$이라는 의미이고,
Nakayama lemma에 의해서 $N/M = 0$이 되어서 $f$는 surjective가 된다.

# Theorem 1

## Statement
$X$와 $Y$가 variety이고, $X$는 complete이라고 하자.
$L$과 $M$을 $X \times Y$위에 있는 line bundle이라고 하자.\
\
만약에 모든 closed point $y \in Y$에 대해서 restriction $L\_y = L |\_{X\times \\{y\\}}$와 $M\_y = M|\_{X\times \\{y\\}}$에 대해서, $L\_y \cong M\_y$라면,\
\
$Y$위의 어떤 line bundle $N$이 존재해서 $L \otimes M^{-1} \cong p^{\ast}N$을 만족한다. 여기서 $p : X\times Y \to Y$는 projection morphism을 의미하고,
$p^{\ast}$는 pullback을 의미한다. 즉,

<center>
$
    (p^{\ast}N)(U) = \{f\circ p: f \in N(p(U))\} \text{ for an open set } U \subseteq X\times Y.
$
</center>

## Statement 해석
$X \times Y$ 위의 두 line bundle $L$과 $M$에 대해서 $y\in Y$를 매개변수로 봤을 때, local하게는 isomorphic하지만, global하게는 다를때, 우리는 $L$과 $M$이 global하게 어디선가 꼬임의 차이가 있다고 생각할 수 있다.

꼬임에 대한 정보는 $L \otimes M^{-1}$이라는 line bundle에 들어있다.

Variety $X$가 complete일 땐, $Y$위의 line bundle $N$이 존재해서
$ L \otimes M^{-1} \cong p^{\ast}N$가 되어 꼬임에 대한 정보가 온전히 variety $Y$로부터 온다는 것을 의미한다. 

## Proof
먼저, $L_y \otimes {M_y}^{-1}$이 trivial line bundle이므로,
<center>
$
    L_y \otimes M_y^{-1} = \mathcal{O}_{X \times \{y\}}
$
</center>
이므로, $L_y \otimes M_y^{-1}$의 global section은 $X \times \\{y\\}$위의 regular function이 된다. $X$가 complete이므로 $X \times \\{y\\}$ 도 complete이 되는데, complete variety 위의 regular function은 constant 뿐이므로, $L_y \otimes M_y^{-1}$의 global section은 constant 뿐이다.

$X\times \\{y\\}$는 $\mathcal{O}\_X \otimes\_k k(y)$라는 sheaf를 가지므로, 여기서 constant는 residue field $k(y)=\mathcal{O}\_{Y,y} / \mathfrak{m}\_y$이다. 

참고로, $\mathcal{O}_{Y,y}$가 아니라 residue field가 나오는 이유는 $\mathcal{O}\_{Y,y}$는 topological 하게 점이 두 개이고 (generic point 와 $\mathfrak{m}\_y$), residue field를 사용해야 점이 하나가 되기 때문이다.

$p\_{\ast}(L\otimes M^{-1})$는 $Y$위의 sheaf로써 다음과 같이 정의한다.

<center>
$
    p_{\ast}(L \otimes M^{-1})(U) = \Gamma(X \times U, L \otimes M^{-1}).
$
</center>

$p$는 flat하고, $X$는 complete해서 $p$는 proper이고, $L \otimes M^{-1}$은 locally free이므로 coherent하며, $H^0(X\_y, L\_y\otimes M\_y^{-1})$는 locally constant이므로, **cohomology and base change** 정리에 의해서
$p\_{\ast}(L \otimes M^{-1})$은 rank 1 locally free sheaf, 즉, line bundle이다. 이를 $Y$위의 line bundle $N$이라고 표기하자. 이제 다음을 보이면 충분하다.

<center>
$
    p^{\ast}N \cong L \otimes M^{-1}.
$
</center>

$y\in Y$에 대한 fiber를 생각하면, 아래와 같은 cartesian diagram을 먼저 그리고,

<center>
$
    \begin{array}{ccc}
    X \times \{y\} & \xrightarrow{\ i_y\ } & X \times Y \\
    {\scriptstyle p_y}\downarrow & & \downarrow{\scriptstyle p} \\
    \mathrm{Spec}(k(y)) & \xrightarrow{\ j_y\ } & Y
    \end{array}
$
</center>

이 cartesian diagram에 의해서 아래 수식을 얻는다.

<center>
 $
 (p^{\ast}N)_y = i_y^{\ast}p^{\ast}N = p_y^{\ast}j_y^{\ast}N = p_y^{\ast}(N \otimes_k k(y)) = \mathcal{O}_{X_y} \otimes_{k(y)} (N\otimes_k k(y)) \cong \mathcal{O}_{X_y} \otimes_{k(y)} H^0(X_y, L_y \otimes M_y^{-1})
 $
</center>

마지막 isomorphism은 **cohomology and base change**정리로부터 얻는다.
statement의 가정 $L\_y \cong M\_y$에 의해서 $L\_y \otimes M\_y^{-1} \cong \mathcal{O}\_{X\_y}$를 얻는다. 따라서, $(p^{\ast}N)\_y \cong (L \otimes M^{-1})\_y$ for all $y \in Y$ 이다.

$p^{\ast}N, L\otimes M^{-1}$ 둘 다 locally free rank 1라는 사실과 **Nakayama lemma**에 의해서 $p^{\ast}N \cong L\otimes M^{-1}$이다.

# See-saw principle
## Statement
$X$와 $Y$가 variety이고, $X$는 complete이라고 하자.
$L$과 $M$을 $X \times Y$위에 있는 line bundle이라고 하자.\
\
만약에 모든 closed point $y \in Y$에 대해서 restriction $L\_y = L |\_{X\times \\{y\\}}$와 $M\_y = M|\_{X\times \\{y\\}}$에 대해서, $L\_y \cong M\_y$이고,\
\
어떤 $x \in X$에 대해서 $L\_x \cong M\_x$라면, $L \cong M$이다.
## Proof
Theorem 1에 의해서 $Y$위의 line bundle $N$이 존재해서 $L \otimes M^{-1} \cong p^*{\ast}N$이다. $X = x$에 대한 fiber를 생각하면,
$L\_x \otimes M\_x^{-1} \cong (p^{\ast}N)\_x$이다. 문제 조건에 의해서 $L\_x \otimes M\_x^{-1} = \mathcal{O}\_{\\{x\\}\otimes Y}\cong (p^{\ast}N)\_x$이므로 $N = \mathcal{O}\_Y$이고,
$L \cong M$이다.

# References
+ [Moonen - Abelian Variety](https://www.math.ru.nl/~bmoonen/BookAV/LineBund.pdf)