---
title: Non-constant Morphism of Curves is surjective
subtitle: 왜 Morphism of curve가 constant 아니면 surjective 인지 알아보자
tag: Mathematics
use_math: true
key: post_20210218
---

* 해당 글은 Fulton의 [Algebraic Curves](http://www.math.lsa.umich.edu/~wfulton/CurveBook.pdf)와 Silverman의 [Arithmetic of Elliptic Curves](https://www.springer.com/gp/book/9780387094939)를 정리한 것이다.

* Finite field $\mathbb{F}\_p$ 위에서 정의된 두 Elliptic Curve $C_1, C_2$의 점 개수가 같으면 두 Curve는 isogenous 임이 알려져있다. degree가 1보다 큰 isogeny를 적용했을 때 점 개수가 줄어듦이 명확하고, 따라서 [surjective가 아니게 되는 문제에 대한 의문](https://math.stackexchange.com/questions/2969598/if-isogenous-elliptic-curves-have-equal-numbers-of-points-how-can-isogenies-hav)을 해결한다.

## Dimension of a curve

Variety $V$의 dimension은 function field $K(V)$를 field extension of $K$라고 생각했을 때, 해당 extension의 transcendence degree를 말한다. transcendence degree는 algebraic 하게 generate되지 않는 extension field 위의 원소들의 dimension을 뜻한다. transcendence degree가 $n$이면, algebraic basis의 개수는 $n$개가 된다.

Curve $C$는 dimension이 1인 variety로 정의된다. 따라서 $K(C)$의 transcendence degree가 1이라는 의미이다. algebraic basis는 한 개이고, 이를 $t \in K(C) \setminus K$라고 하자. 그러면 $K(C)$는 $K(t)$에 대한 algebraic field extension(finite field extension)이다.

## Any proper closed subvariety of a curve is a point

curve 위에서 어떤 proper closed subvariety(아직 zariski topology를 정리하지 않았으므로 여기서는 간단히 affine variety를 생각하자)는 항상 점 한개로 구성됨을 증명하자. 아래 두 개의 claim을 거쳐야 한다.

##### Claim 1. $K$가 algebraically closed 이면, 임의의 원소 $x \in K(C) \setminus K$에 대해 $K(C)$는 $K(x)$에 대한 algebraic field extension이다.(Fulton 6. Proposition 9(1))

_Proof)_ algebraic basis를 $t \in K(C) \setminus K$라고 하자. 임의의 원소 $x \in K(C) \setminus K$에 대하여 minimal polynomial $f = \sum_{i,j} a_{ij} t^i X^j \in K(t)[X]$가 존재해서 $\sum_{i,j} a_{ij} t^i x^j = 0$을 만족한다. 여기서 <font color='red'>$K$가 algebraically closed</font>인 경우, $x$는 $K$ 위의 algebraic number가 될 수 없다. 따라서 polynomial $f(t,x)$는 t에 대한 polynomial이 되어 $t$는 $x$로부터 algebraically 생성된다.

<div style="text-align: right">□</div>

##### Claim 2. $K$가 algebraically closed이고, Ring $R$이 존재해서 quotient field $K(C)$를 갖는다고 하면, $R$ 위의 prime ideal $I$에 대해 항상 $R/I \cong K$이다.(Fulton 6. Proposition 9(3))

_Proof)_ 귀류법으로 $R/I$ 상에서 $K$에 포함되지 않는 $x$가 존재한다고 가정하자. 그러면 **Claim 1.** 에 의해서 $K(C)$는 $K(x)$에 대한 algebraic field extension이다. 그러면 $y \in I$에 대해 minimal polynomial $f = \sum_{i} a_{i}(x)X^i \in K(x)[X]$가 존재해서 $\sum_{i} a_{i}(x) y^i = 0$을 만족한다. 
$f$는 minimal polynomial이므로 $a_0(x) \neq 0$이다. quotient ring $R/I$ 상에서 $f(y) = a_0(x) = 0$이 된다. 이는 $x$가 $K$에 대해 algebraic하다는 의미로 모순이다. 따라서 이러한 $x$가 존재하지 않는다. 

<div style="text-align: right">□</div>

이제 **Claim 2.** 를 이용해 아래의 **Proposition 3.** 을 증명할 것이다.

##### Proposition 3. $K$가 algebraically closed 일 때, Curve 위에 존재하는 모든 proper closed subvariety 점 하나로 구성된다.(Fulton 6. Proposition 10(4))

_Proof)_ Curve $C$에 대한 coordinate ring $K[C]$를 생각하자. curve 위의 closed subvariety $W \subset C$는 $K[C]$에 속하는 prime ideal $I \subset K[C]$에 대응된다. **Claim 2.** 에 의해 $K[C]/I \cong K$ 임을 알고 있다. 이는 subvariety W에 대한 coordinate ring $K[W]$와 isomorphic하다. 따라서 subvariety $W$는 Curve $C$ 위의 한 점이 된다.

<div style="text-align: right">□</div>

## Non-constant morphism of curves is surjective 

Morphism $\varphi: C_1 \rightarrow C_2$는 zariski topology 상에서 continuous하다. $C_2$는 curve이므로 **Proposition 3.** 에 의해 $C_2$ 위의 proper closed subvariety는 하나의 점으로 구성된다. morphism은 $C_1$ 위의 모든 점에서 define되며, $C_1$은 closed subvariety이므로 morphism $\varphi$의 image는 하나의 점이거나 Curve $C_2$ 전체가 된다. 따라서 constant이거나 surjective인 것이다!

## Degree of a morphism

non-constant morphism은 surjective이다. 또한 morphism $\varphi$에 대한 induced map $\tilde{\varphi}: K(C_2) \rightarrow K(C_1)$을 생각했을 때, $\tilde{\varphi}(K(C_2))$는 transcendence degree 1을 갖는다. 따라서 $K(C_1)$은 $\tilde{\varphi}(K(C_2))$에 대한 algebraic field extension이 되며, 아래와 같이 extension degree를 morphism의 degree로 정의할 수 있다.

<center>$deg(\varphi) = [K(C_1):\tilde{\varphi}(K(C_2))]$</center>

해당 degree는 isogeny에서 group homomorphism의 degree 정의와 유사한 의미를 갖는다. group homomorphism에서는 kernel의 크기로 degree를 정하기 때문에 inseparable degree가 표현되지 않지만, 위와 같이 정의된 morphism의 degree는 inseparable degree를 반영한다.(inseparable degree를 가지려면 field $K$의 characteristic이 0보다 커야하며, 이에 대한 algebraic closure $\bar{\mathbb{F}}\_p$를 생각한다.)

## Curves on a finite field

Finite field $\mathbb{F}\_p$ 위에서 정의된 두 Elliptic Curve $C_1, C_2$의 점 개수가 같으면 두 Curve는 isogenous 임이 알려져있다. degree가 1보다 큰 isogeny를 적용했을 때 점 개수가 줄어듦이 명확하고, 따라서 [surjective가 아니게 되는 문제에 대한 의문](https://math.stackexchange.com/questions/2969598/if-isogenous-elliptic-curves-have-equal-numbers-of-points-how-can-isogenies-hav)이 발생한다.

 > 사실 이 문제가 머릿속에서 해결이 안되서 포스트로 정리해 본 것이었다. 하지만 생각보다 간단한 문제였던 것 같다..

이러한 오류가 발생하는 원인은 Finite field $\mathbb{F}\_p$ 위에서 우리가 생각하는 일반적인 Curve들이 irreducible하지 않다는 것을 간과한 것이다. Finite field에서는 모든 algebraic set들이 finite 개수의 점을 갖는다. 각각의 점은 variety이기 때문에 variety의 유한 합으로 표현 가능하고, 당연히도 irreducible하지 않게 된다.

variety는 한 점으로만 구성되며, 이러한 점은 coordinate ring이 $\mathbb{F}\_p$와 같아져서 dimension이 0이기 때문에 curve가 존재하지 않는다고 볼 수 있다. curve 개념이 생기기 위해서는 field의 원소 개수가 무한해야하며, algebraic closure of finite field $\bar{\mathbb{F}}\_p$ 위에서 생각해야할 것이다. 여기서는 curve가 존재하기 때문에 non-constant morphism of curves가 surjective임을 사용할 수 있다.
또한 p-adic field $\mathbb{Q}\_p$에서도 마찬가지로 사용할 수 있다.
