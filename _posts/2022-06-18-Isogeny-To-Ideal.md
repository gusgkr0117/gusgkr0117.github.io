---
title: Ideal To Isogeny
subtitle: Ideal을 Isogeny로 변환하는 방법(SQISign 참조)
tags: PQCrypto
use_math: true
key: post_20220618
---

* Deuring Correspondence에 의하면 Isogeny와 Ideal은 대응관계에 있다.
* Supersingular elliptic curve $E$에 대해서 maximal order $\mathcal{O}$에 대해 $\mathrm{End}(E) \cong \mathcal{O}$를 만족할 때, $E$를 codomain으로 가지는 isogeny $\phi:E \rightarrow E'$은 left $\mathcal{O}$-ideal $I$에 대응된다.
* Isogeny 기반 서명 기법인 SQISign에서 서명 시 가장 오래걸리는 부분이 바로 $\mathcal{l}^e$-Ideal을 Isogeny로 변환하는 과정이다.

<!--more-->

## KLPT 알고리즘

KLPT 알고리즘은 임의의 ideal $I$가 주어졌을 때, ideal $I$와 equivalent하면서 원하는 norm을 가지는 다른 ideal $J$를 찾는 알고리즘이다. KLPT 알고리즘은 따로 포스팅을 통해 다루기로하고, 여기서는 KLPT 알고리즘이 IdealToIsogeny에서 어떤 역할을 하고, 이를 어떻게 활용하는지에 대해서만 짚고 넘어가도록 하겠다.

기본적인 KLPT 알고리즘은 special $p$-extremal maximal order $\mathcal{O}_0$의 특성을 활용한다. $\mathcal{O}_0$에는 $\mathbb{Z} + i\mathbb{Z} + j\mathbb{Z} + ij\mathbb{Z}$를 suborder로 포함하고 있다는 특징을 가지며, $\mathcal{O}_0$의 basis는 $1, i, \frac{i + j}{2}, \frac{1 + ij}{2}$이고, supersingular elliptic curve $E(\bar{\mathbb{F}_p}) : y^2 = x^3 + x$의 endomorphism ring과 isomorphic 하다는 것이 알려져있다. 이러한 특별한 maximal order $\mathcal{O}_0$를 이용해 원하는 ideal을 계산하는 것이 KLPT 알고리즘의 핵심이다.

$\mathcal{O}_0$의 basis들을 활용해 원하는 norm을 가지는 원소 $\beta \in I \subset \mathcal{O}_0$를 찾게 되는데, 원하는 norm 값이 $N$이라면, $\gcd(N,n(I)) = 1$을 만족해야만 해 $\beta$를 구할 수 있다.

## Ideal을 Isogeny로 변환

left $\mathcal{O}_1$-ideal $I$가 어떤 isogeny $\phi:E_1 \rightarrow E_2$에 대응된다는 것은 알겠는데, left ideal $I$가 주어졌을 때, 대응되는 isogeny를 어떻게 practical하게 계산할 수 있을까? 실제 서명기법에서 활용하기 위해서는 어떻게 효율적으로 계산할 수 있을까?

일단 "효율적으로 계산할 수 있는 Isogeny"란 무엇인가 생각해보아야 한다. Isogeny의 kernel point들이 모두 적절히 낮은 차원의 field extension $\mathbb{F}\_{p^n}$ 위에서 정의된다면, Velu's formula를 이용해 효율적으로 계산할 수 있을 것이다. "적절히 낮은 차원"의 기준을 $\mathbb{F}\_{p^2}$ 이라고 한다면, 우리는 모든 연산을 $\mathbb{F}\_{p^2}$ 위에서 수행하고 싶은 상황이다.

### Ideal을 분해하자

> 일단 SQISign의 환경과 같이 주어지는 left ideal $I$의 norm은 $\mathcal{l}^e$ 꼴을 가진다고 하자.

$E(\mathbb{F}\_{p^2})$ 의 point 개수는 유한하기 때문에 $\mathbb{F}\_{p^2}$ 으로 계산할 수 있는 isogeny의 최대 degree는 $\#E(\mathbb{F}\_{p^2})$ 으로 제한된다. 만일 주어진 ideal의 norm이 $\#E(\mathbb{F}_{p^2})$ 값을 넘는다면, 우리는 해당 ideal에 대응되는 isogeny의 kernel point를 $\mathbb{F}\_{p^2}$ 위에서 표현할 수 없다. 이러한 문제를 해결하기 위해서 우리는 ideal $I$를 degree가 낮은 여러 ideal들로 분해하고, 각각을 $\mathbb{F}_{p^2}$위에서 표현할 것이다.

$n(I) = \mathcal{l}^e$이라고 하자. $\mathbb{F}_{p^2}$위에서 표현할 수 있는 최대 degree가 $\mathcal{l}^f$라고 할 때, $e > f$인 경우, ideal $I$를 분해해야 한다. 이는 아래와 같이 수행할 수 있다.

$I = \mathcal{O}<\alpha, l^e>$이라고 할 때, $I_i = \mathcal{O}<\alpha, l^{if}>$ for $i \in [1,\lfloor e/f\rfloor]$라고 하면, $I \subset I_{\lfloor e/f\rfloor} \subset ... \subset I_2 \subset I_1$을 만족한다. $I_i$에 대응되는 isogeny를 $\phi_i$라고 하면, 이를 이용해서 $\phi$를 degree가 $\mathcal{l}^f$보다 작은 isogeny들로 분해할 수 있다.

### Smooth Odd Degree Isogeny의 필요성

> 여기서 "odd"가 들어가는 이유는 SQISign에서 실제로는 $l=2$로 사용하기 때문이다. 즉, $l$과 coprime인 smooth degree isogeny의 필요성을 의미한다. 여기서부터는 $l=2$로 가정하고 설명하도록 하겠다.

left $\mathcal{O}$-ideal $I$의 generator가 $\alpha \in I$라고 할 때, $\alpha$가 실제로 codomain curve $E$에서 어떤 endomorphism에 해당되는지 알아야지 대응되는 $\phi_I$의 kernel을 구할 수 있을 것이다. 하지만 $\mathcal{O}$와 $\mathrm{End}(E)$의 일대일 대응관계를 바로 알아내기가 어렵기 때문에 우리는 sepcial maximal order인 $\mathcal{O}_0$를 활용해야 한다.

$\mathcal{O}_0$를 활용하기 위해서 $\mathcal{O}_0$으로 pull back한 후에, 대응되는 isogeny의 kernel을 구하고, 해당 kernel의 basis를 다시 curve $E$로 push forward 해줄것이다. 그렇다면 $E_0$에서 $E$로 가는 isogeny $\phi_J$가 필요할 것이고, push forward와 pull back을 이용하기 위해서는 $\gcd(n(I), n(J))=1$이라는 조건이 필요하다. 우리가 $I$의 degree는 $\mathcal{l}^e$ 꼴이라는 것을 알고 있으므로, $\mathcal{l}=2$일 때, ideal $J$ degree는 odd이기만 하면 된다. 또한 push forward를 위해서는 $\phi_J$에 대한 point evaluation 연산이 필요하기 때문에 odd이면서 smooth degree를 가져야만 효율적인 연산이 가능하다.

> 다시말해 special order $\mathcal{O}_0$를 활용하기 위해서는 coprime이면서 smooth degree를 갖는 isogeny $\phi_J$를 이용해서 $\mathcal{O}_0$에서 계산한 $\mathcal{l}^e$ degree의 isogeny를 "밀어"(push forward)주어야한다. 따라서 odd smooth isogeny와 odd smooth isogeny computation이 필요하다.

### Meet-in-the-Middle과 $l^{2f+\Delta}$-isogeny

large odd degree isogeny를 연산하는 것은 꽤 오래걸리는 작업이기 때문에 odd degree isogeny 연산 횟수를 줄이는 것이 서명 기법을 빠르게하는 핵심 아이디어가 된다. ideal $I$를 많은 개수의 ideal로 분해할수록 odd degree isogeny의 연산 횟수가 늘어날 것이기 때문에 최대한 적게 분해되도록 해야한다. 이를 위해 SQISign 저자는 meet-in-the-middle을 활용하는 아이디어를 제안했다.

원래는 $\mathcal{l}^{2f}$-degree의 ideal을 isogeny로 변환하려면 odd degree isogeny 연산을 두 번 수행해야 할 것이다. 하지만 저자는 여기에 meet-in-the-middle을 활용하면 작은 degree $\mathcal{l}^{\Delta}$를 가지는 ideal에 한해서는 odd degree isogeny 연산을 할 필요없이 전수조사를 통해서 isogeny로 변환할 수 있다는 사실을 적용했다. 즉, odd degree isogeny 연산을 두 번 수행했을 때, $\mathcal{l}^{2f+\Delta}$만큼의 isogeny를 얻게되기 때문에 변환 속도가 더 빨라지게 된다.

### SQISign의 `ideal_to_isogeny_two_2f_delta` 함수 코드리딩

앞서 설명한 $2^{2f+\Delta}$ degree인 ideal $I$를 isogeny로 변환하는 방식이 [SQISign Git](https://github.com/SQISign/sqisign)에 오픈소스로 구현이 되어 있다. 해당 섹션에서는 idiso.c에 구현되어있는 `ideal_to_isogeny_two_2f_delta` 함수가 어떻게 구현되어 있는지 따라가보고자 한다.

일단 함수의 인자 값은 아래와 같다.
```c++
void ideal_to_isogeny_two_2f_delta(two_walk_long *phi, GEN *L,
    special_isogeny *phi_L, GEN I, GEN J, GEN K,
    proj *phi_K_basis, proj *phi_K_target, int delta, GEN I_long)
```
변환하고자하는 ideal의 domain을 $E_1$, codomain을 $E_2$라고 할 때, 각 인자에 대한 설명은 아래와 같다.
* ideal `J`는 odd smooth degree이면서 $E_0 \rightarrow E_1$인 left $\mathcal{O}_0$-ideal이다.
* ideal `I`는 변환하고자 하는 ideal과 ideal `J`를 합성하여 degree가 $n(J)\cdot \mathcal{l}^{2f+\Delta}$이면서 $E_0 \rightarrow E_2$인 left $\mathcal{O}_0$-ideal이다.
* ideal `K`는 ideal `J`와 equivalent하면서 degree가 $\mathcal{l}^e$꼴인 left $\mathcal{O}_0$-ideal 이다.
* `phi_K_basis`는 `I` $\subset I_1 \cdot$ `K`
인 degree $\mathcal{l}^{f}$인 ideal $I_1$에 대응되는 isogeny를 $\phi_1$이라고 할 때, $\phi_1 \circ \phi_K($`torsion_basis`$)$를 계산한 값이다.
* `phi_K_target`은 $\phi_1 \circ \phi_K$의 codomain curve를 의미한다.
* `delta`는 meet-in-the-middle을 수행하기 위한 degree $\Delta$를 의미한다.
* ideal `I_long`은 ideal `I`에 포함되면서 degree가 $\mathcal{l}^{total}$인 앞으로 변환하고자 하는 나머지 ideal을 의미한다.

출력 값은 아래와 같다.
* `phi`는 degree가 $\mathcal{l}^{2f+\Delta}$이면서 $E_1 \rightarrow E_2$인 isogeny를 의미한다.
* `L`은 odd smooth degree이면서 $E_0 \rightarrow E_1$인 ideal을 의미한다.
* `phi_L`은 `L`에 대응되는 isogeny를 의미한다.
* `phi_K_basis`와 `phi_K_target`에는 다음 ideal 변환과정에 사용할 basis와 codomain curve가 들어간다.

다음은 함수의 초반부이다.
```c++
GEN L_;

    if (len_step + Z_lval(lideal_norm(K), 2) < dbllog2r(itor(global_setup.p,10))/2. + 10 ) {
        GEN M;
        GEN alpha = lideal_isom(J, K); // J*alpha = K

        M = lideal_mul(I, alpha); // I*alpha, equivalent to I, but norm a power of 2

        L_ = klpt_special_smooth_small_2e_input(M, famat_sqr(famat_mul(global_setup.gen_p_plus_fact, global_setup.gen_p_minus_fact)));
    }
    else {
        L_ = klpt_special_smooth(I, famat_sqr(famat_mul(global_setup.gen_p_plus_fact, global_setup.gen_p_minus_fact)));
    }
```

