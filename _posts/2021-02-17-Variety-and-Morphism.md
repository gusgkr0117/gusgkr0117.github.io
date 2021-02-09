---
title: Variety and Morphism
subtitle: Variety와 Morphism 이해가기
tag: Mathematics
use_math: true
key: post_20210217
---

* 해당 글은 Silverman의 [Arithmetic of Elliptic Curves](https://www.springer.com/gp/book/9780387094939)의 Chapter 1을 정리한 것이다.

* Diopantine equation은 $ax + by = c$를 만족하는 정수해 $x, y$를 찾는 것을 말한다. 만약 2차 다항식이거나 변수가 $x,y$가 아니라 $x_1, x_2, ..., x_n$으로 많다면 정수해를 어떻게 찾을 수 있을까? 그리고 그들은 어떤 특징을 가질까?

* 다항식을 통해 얻을 수 있는 점들의 집합은 대수적으로 어떤 특성을 갖는지 분석하는 것이 대수기하학이다. 이것의 기본이 되는 기념이 algebraic set, variety라고 할 수 있다.

* $K$ : field, $\bar{K}$ : algebraic closure of $K$, $G_{\bar{K}/K}$ : Galois group of $\bar{K}/K$

* $K[X_1, X_2, ... , X_n]$는 간단히 $K[X]$로 표기하도록 하겠다.

* $\mathbb{A}^n = \\{(y_1, y_2, ..., y_n) : y_i \in bar{K} for 1 \leq i \leq n\\}$이고, $\mathbb{A}^n(K) = \\{(y_1, y_2, ..., y_n) : y_i \in K for 1 \leq i \leq n\\}$로 표기하겠다.


## Algebraic set

$\bar{K}[X]$ 상의 ideal $I \subset bar{K}[X]$가 주어졌을 때, algebraic set $V_I$는 아래와 같이 정의된다.

<center>$V_I = \{P \in \mathbb{A}^n : f(P) = 0 for \forall f \in I}$</center>

algebraic set $V_I$는 일반적으로 $V$로 생략해서 표기한다. $I(V)$가 만일 $K[X]$에 들어있는 함수들로 generate 된다면, $V$는 $K$ 위에서 정의되었다고 하며 이를 $V/K$라고 표기한다. $V(K)$는 $V$에 속하는 점들 중에서 $K$ 위에서 정의된 점들을 말하며 아래와 같이 정의된다.

<center>$V(K) = V \cap \mathbb{A}^n(K)$</center>

또한 $I(K) = I(V) \cap K[X] \subset \bar{K}[X]$로 정의한다. 정의에 따르면 $V/K$에 대해 아래와 같은 식을 도출 할 수 있다.

<center>$I(V) = I(K)\bar{K}[X]$ if $V$ is defined over $K$</center>

### Variety

variety란, algebraic set $V$에 대해 $I(V) \subset \bar{K}[X]$가 <font color='blue'>prime ideal이면 $V$를 variety라고 한다.</font>

$\bar{K}$는 field이므로 noetherian이다. [Hilbert basis theorem](https://en.wikipedia.org/wiki/Hilbert%27s_basis_theorem)에 의해 $\bar{K}[X]$도 따라서 noetherian이다. 따라서 $\bar{K}[X]$에 속하는 ideal들은 prime ideal의 곱으로 unique하게 표현할 수 있다. 이와 마찬가지로 algebraic set $V$는 variety들의 union으로 아래와 같이 유일하게 표현된다.

<center>$V = V_1 \cup V_2 \cup ... \cup V_n$ where $V_i$ is variety</center>

ideal $J$가 주어졌을 때, $I(V(J))$은 사실 $Rad(J) = \\{f : f^m \in J for some m \in \mathbb{Z}^+ \cup {0}\\}$와 같다. 따라서 위와 같이 variety의 union에서는 제곱식이 표현이 안되는 것이다.

### Coordinate ring and function field

algebraic set $V$가 주어지면 $\bar{K}[X]/I(V)$를 Coordinate ring이라고하고, $\bar{K}[V]$로 표기한다. $V$가 variety이면, $I(V)$가 prime ideal이고, $\bar{K}[V]$는 integral domain이 되며, quotient field(field of fraction)을 정의할 수 있다. 이를 $\bar{K}(V)$로 표기하고, function field라고 부른다.

만약에 variety $V$가 $K$ 위에서 정의되었다면, Galois group $G_{\bar{K}/K}$에 의해 $I(V)$는 $I(V)$로 그대로 맵핑된다. 따라서 $\bar{K}[V], \bar{K}(V)$에 있는 원소에 대해서 Galois group은 obvious하게 동작한다. 이 말은 $f \in bar{K}[V]$와 $\sigma G_{\bar{K}/K}$에 대해 $f^{\sigma}$는 $I(V)$를 신경쓰지 않고, group action을 수행해도 된다는 의미이다.

$dim(V)$는 $\bar{K}[V]$의 $\bar{K}$ 위에서 transcendence degree를 말한다. 예를 들어, $V : f(x_1, ..., x_n) = 0$ 일 때, $f$가 non-constant function이면, $\bar{K}[X]/\\< f \\>$는 algebraic basis가 $n-1$개 이므로 $dim(V) = n-1$임을 알 수 있다.

<font color="blue">function field $\bar{K}(V)$의 원소는 맵핑 $f: V \rightarrow \bar{K}$로 obvious하게 대응됨을 알 수 있다.</font> 이게 굉장히 재미있는 부분인데, algebraic set $V$에 있는 점 각각을 $\bar{K}$로 임의로 맵핑하는 것은 사실 $\bar{K}(V)$에 속하지 않을 수도 있다. $\bar{K}(V)$는 polynomial 특성(?)을 가지는 맵핑 $V \rightarrow \bar{K}$에 관한 정보를 담고 있다고 볼 수 있다.

<center><img src="/assets/20210217_1.png" width="40%"></center>

## Projective space

우리가 위에서 사용했던 $\mathbb{A}^n$은 Affine space라고 부른다. Projective space $\mathbb{P}^n$은 아래와 같이 정의된다.

 > projective space를 사용하면 평행인 직선도 결국 point at infinity에서 만남을 알 수 있다. 그러면 rough하게 n차 다항식과 m차 다항식이 둘다 nonsingular인 경우에 prjective space 위에서 $nm$개의 점에서 만남을 추론할 수 있다.([Bezout's theorem](https://en.wikipedia.org/wiki/B%C3%A9zout%27s_theorem)) 이와 같은 특성을 사용하게 위해 projective space를 사용한다.

<center>$\mathbb{P}^n = \mathbb{A}^{n+1}/~$</center>

relation $\~$는 $(y_1, ..., y_{n+1}) \~ ({y_1}', ..., {y_{n+1}}')$이면 $(y_1, ..., y_{n+1}) = (\lambda{y_1}', ..., \lambda{y_{n+1}}')$ for some $\lambda \in \bar{K}$를 의미한다.

projective algebraic set $V$는 homogeneous 함수들로 generate되는 ideal $I \in \bar{K}[X_1, ..., X_{n+1}]$로부터 정의되며, $I(V)$ 또한 homogeneous 함수들로 generate되는 ideal을 말한다. 아래와 같은 subset을 이용하면 projective set $\mathbb{P}^n$과 affine set $\mathbb{A}^n$을 연결할 수 있다.

<center>$U_i = \\{[y_1/y_i, ..., 1, ..., y_{n+1}/y_i] \in \mathbb{P}^n : y_i \neq 0\\}$</center>

$\phi_i : U_i \rightarrow \mathbb{A}^{n}$인 one-to-one map을 obvious하게 정의할 수 있다. 그러면 아래와 같은 조건을 만족한다.

<center>$\mathbb{P}^n = {\phi_1}^{-1}(\mathbb{A}^n) \cup ... \cup {\phi_{n+1}}^{-1}(\mathbb{A}^n)$</center>

projective algebraic set $V$가 주어졌을 때, 이를 affine space에서 바라본다면, $\phi_i(V \cap U_i)$가 되고, $V - U_i$에 속하는 점들을 point at infinity라고 부른다.

 > Elliptic Curve Cryptography에서 사용하는 그 point at infinity의 개념이 여기서 나온 것이다.

affine algebraic set $V$이 주어지면 $I(V)$를 찾을 수 있고, 이 것의 generator set $\\{f_1, ..., f_m\\} \subset \bar{K}[X_1, ..., X_n]$을 찾을 수 있다.($\bar{K}[X]$는 noetherian이므로 finitely generate된다.) 해당 generator들을 homogenization 시키면, $\\{{f_1}^{\*}, ...,{f_m}^{\*}\\} \subset \bar{K}[X_1, ..., X_{n+1}]$가 되고, 이들을 통해 generate되는 ideal로 만들어지는 projective algebraic set $V'$을 생각할 수 있다. 이렇게 만들어진 projective algebraic set은 $V = \phi_{n+1}(V' \cap U_{n+1})$을 만족한다.

따라서 우리는 projective algebraic set $V \in \mathbb{P}^n$이 주어지면 이를 affine algebraic set으로 표현할 수 있고, 이는 곧 dehomogenization된 polynomial $\in \bar{K}[X_1, ...,X_n]$으로 표현할 수 있다!

## Rational map and Morphism

두 개의 projective variety $V_1 \in \mathbb{P}^n$과 $V_2 \in \mathbb{P}^m$이 주어졌을 때, 아래와 같은 map을 생각하자.

<center>$\varphi : V_1 \rightarrow \V_2$ where $\varphi(P) = [f_1(P), ..., f_{m+1}(P)]$ for $P \in V_1$, $f_i \in \bar{K}(V)$</center>


이렇게 정의된 mapping은 well-define되며, rational map이라고 부른다. rational map의 정의에 따르면, rational map $\varphi$가 모든 점 $P \in V_1$ 위에서 정의될 필요는 없다. 모든 점 $P \in V_1$ 위에서 정의된다면 이러한 rational map을 morphism이라고 부른다.

> 이런식으로 morphism을 정의하면 rational map은 variety topology([zariski topology](https://en.wikipedia.org/wiki/Zariski_topology))에 대한 continuous function이 된다!

projective variety $V_1, V_2$에 대해 두 morphism $\psi : V_1 \rightarrow V_2$와 $\varphi : V_2 \rightarrow V_1$가 존재해서, $\psi \circ \varphi$와 $\varphi \circ \psi$가 identity가 되면 $V_1, V_2$는 isomorphic하다고 한다. 