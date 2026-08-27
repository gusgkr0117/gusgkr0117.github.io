---
title: Yoneda Lemma
subtitle: Yoneda Lemma 이해하기
tags: Mathematics, Category Theory
use_math: true
key: post_20260827
---

* Yoneda Lemma는 어떤 object $X$에 대해서, 같은 category 안에 있는 모든 object로부터 출발해서 해당 object $X$로 가는 모든 morphism은
해당 object에 대한 정보를 완벽하게 담고있음을 증명한다. 
* Formal하게 category의 object $A$는 Functor $\mathrm{Mor}(*, A)$에 의해 결정된다.

<!--more-->

# Statement of Yoneda Lemma
$\mathcal{C}$를 어떤 category라고 하자. $X$를 $\mathcal{C}$ 안의 object라고 하자.

Functor $h_X: \mathcal{C} \to \mathrm{Sets}$는 다음과 같이 정의한다.

<center>
$
    h_X(A) = \mathrm{Mor}(A, X)
$
</center>

그리고

<center>
$
    h_X(f : A \to B) : \mathrm{Mor}(B, X) \to \mathrm{Mor}(A, B), g \mapsto g \circ f
$
</center>

를 만족한다.

Functor $h_X$는 $X$를 up to isomorphism으로 unique하게 결정한다.

# Proof of Yoneda Lemma

(a) Category $\mathcal{C}$ 안에서 어떤 object $X'$를 선택해서 functor $h_{X'}$을 생각하자.

두 functor $h_X$와 $h_{X'}$ 사이에 natural transformation $\eta$를 생각하자. 그러면 아래 diagram을 commutative하게 만든다.

<center>
$
    \begin{array}{ccc}
    \mathrm{Mor}(B, X) & \xrightarrow{\ h_X(f)\ } & \mathrm{Mor}(A, X) \\
    {\scriptstyle \eta_B}\downarrow & & \downarrow{\scriptstyle \eta_A} \\
    \mathrm{Mor}(B, X') & \xrightarrow{\ h_{X'}(f)\ } & \mathrm{Mor}(A, X')
    \end{array}
$
</center>

이 commutative diagram은 모든 object $A,B$와 morphism $f : A \to B$에 대해 성립한다.

$B = X$일 때, 왼쪽 위의 object는 $\mathrm{Mor}(X, X)$가 되며, 이 set에서 identity morphism $\mathrm{id}_X$를 선택할 수 있다.

위의 commutative diagram에 의해서 $\eta_X(\mathrm{id}_X) \circ f = \eta_A(\mathrm{id}_X \circ f) = \eta_A(f)$를 만족한다.
따라서 우리는 모든 object $A$와 morphism $f : A \to X$에 대하여

<center>
$
    \eta_A(f) = \eta_X(\mathrm{id}_X) \circ f
$
</center>

관계를 얻는다.

(b) 만약 $h_X$와 $h_{X'}$이 natural isomorphism이라면, 즉, $\eta_A$가 모든 $A$에 대해 bijection이라면,

$A = X'$ 일 때, $\eta_{X'}(f) = \eta_X(\mathrm{id}_X) \circ f$ for $f : X' \to X$이고,

$\eta_{X'}(f) = \mathrm{id}_{X'} = \eta_X(\mathrm{id}_X) \circ f$인 $f$가 존재한다.

따라서, $f: X' \to X$는 isomorphism이고, $X'$과 $X$는 isomorphic하다.

이것으로 Yoneda Lemma가 증명된다.

# Universal Property와 관계
Category theory에서 initial object, final object, zero object, product, tensor product, fiber product, localization 과 같이
새로운 object를 만드는 과정은 universal property를 활용한다.

Universal property는 "새로운 object와 모든 object들과의 관계"를 정의함으로써 새로운 object를 up to unique isomorphism으로 유일하게
결정되도록 생성한다.

이런 현상이 일어나는 이유는 Yoneda Lemma로부터 알 수 있다. 어떤 object는 사실 모든 object와 해당 object와의 관계로 완벽하게 표현된다.
따라서 universal property는 Yoneda Lemma를 이해하면 자연스러운 과정으로 느껴진다.


# References
+ [Ravi Vakil, MATH 216: Foundations of Algebraic Geometry, 2024](https://math.stanford.edu/~vakil/216blog/), p.42