---
title: Grover Algorithm with a Single Query
subtitle: Arbitrary phase를 이용한 Grover algorithm 이해하기
tag: Quantum_Algorithm
use_math: true
key: post_20210216
---

* 해당 글은 1997년도 논문 [Quantum Database Searching by a Single Query](https://arxiv.org/pdf/quant-ph/9708005.pdf)를 정리한 것이다.
* 주어진 함수 $f:\mathbb{Z}\_n \rightarrow \\{0,1\\}$에서 $f(x)=1$을 만족하는 해의 비율이 충분히 클 때, 한 번의 쿼리로 Grover algorithm을 수행할 수 있다.

## 기존 Grover Algorithm

임의의 함수 $f:\mathbb{Z}\_n  \rightarrow \\{0,1\\}$이 주어졌을 때, $f(x)=1$을 만족하는 $x$가 단 한개만 존재하면, $O(2^{(n/2)})$ 만큼의 query로 $x$를 찾을 수 있다. 함수 $f$에 대한 blackbox quantum Oracle $O_{f}^{0}$는 다음과 같이 작동한다.

$\newcommand{\ket}[1]{\left| #1 \right>}$
<center>$O_{f}^{0}\ket{x}\ket{0} = \ket{x}\ket{f(x)}$</center>

얻어진 quantum state에 두번째 레지스터로 control되는 controlled-phase $\pi$ shift gate를 $x$ 레지스터를 이루는 각각의 qubit에 적용하면 아래와 같은 새로운 Oracle $O_{f}^{1}$를 얻을 수 있다.

<center>$O_{f}^{1}\ket{x}\ket{0} = (-1)^{f(x)}\ket{x}\ket{f(x)}$</center> 

여기서 black box Oracle을 한 번 더 적용해서 두번째 레지스터를 초기화시켜주면 아래와 같은 원하는 Oracle $O_f$가 된다.

<center>$O_f\ket{x} = (-1)^{f(x)}\ket{x}$</center>

 > 이와 같은 방식으로 얻어낸 phase 변환 oracle은 엄밀히 따지면 함수 $f$에 대한 oracle에 두번씩 query를 날리게 되는 것은 아닌지 궁금하다. 두번째 레지스터를 초기화해주려면 $f$를 무조건 두 번 수행해주어야 하는 것 아닌가? 아니면 최적화 할 수 있는 방법이 있는 걸까?

물론 superposition이 아니라면 phase shift는 무시되겠지만, Grover algorithm에서는 다음과 같이 uniform superposition state를 oracle에 입력으로 넣는다. global phase는 무시한채 식을 쓰면,

<center>$O_f(\sum_{x=0}^{2^n-1} \ket{x}) = \sum_{x=0}^{2^n-1} (-1)^{f(x)}\ket{x}$</center>

이렇게 얻은 quantum state는 실제로 $f(w)=1$을 만족하는 $w \in \\{0,1\\}^n$ 한 개만 phase가 -1인 superposition state이다. 이 과정을 reflection 단계라고 부른다. 다음은 여기에 diffusion operator라는 것을 적용할 것이다. diffusion operator $U_s$는 아래와 같이 주어진다.

$\newcommand{\bra}[1]{\left< #1 \right|}$
<center>$U_s = 2\ket{s}\bra{s} - I_n$ where $\ket{s} = \frac{1}{\sqrt{2^n}}(\sum_{i=0}^{2^n-1} \ket{i})$</center>

Hilbert space $\mathbb{C}^{N}$에서 생각해보면, diffusion operator는 Hilbert space 위의 벡터 $\ket{s}$에 대한 대칭이동을 의미한다. 또한 oracle operator $O_f$를 적용하는 것은 $\ket{w}$로 생성되는 벡터 공간에 수직인 공간에 대한 대칭 이동을 의미한다. 따라서 이를 $\ket{w}$와 $\ket{s}$에 의해 생성되는 2차원 평면 상에서 그림을 그리면 아래와 같이 동작한다.

<center><img src="/assets/20210216_1.png" width="400" height="300"></center>

위 그림과 같이 $\ket{v}$에 $O_f$와 $U_s$를 차례대로 적용하면, 반시계 방향으로 $\theta$만큼 1회 회전한다는 것을 알 수 있다. recursive하게 이를 $r$번 적용하면 총 $r\theta$만큼 회전하게 되어 우리가 원하는 $\ket{w}$ 벡터에 최대한 가까운 값을 얻기 위해서는 $\sin^2((r+\frac{1}{2})\theta)$ 값이 최대가 되는 $r$을 선택한다.$\sin(\frac{\theta}{2}) = \frac{1}{\sqrt{N}}$을 만족하므로, $r \approx \pi \sqrt{N}/4$ 일 때, $\ket{w}$에 가장 가깝다.

### Diffusion operator

Diffusion operator는 $U_s = 2\ket{s}\bra{s} - I_n$인데 이를 어떻게 quantum circuit으로 구현할 수 있을까?

$U_s = H(2\ket{0^n}\bra{0^n}-I_n)H^{\textdagger}$를 만족하므로 사실 우리는 $\ket{0^n}\bra{0^n} - I_n$을 구현할 수 있기만 하면 된다. 주어진 Unitary Operator에 대응하는 circuit을 구현할 때 가장 간단한 방법은 basis vector에 대해서만 원하는 값이 나오도록 circuit을 구성하면 된다. 그러면 모든 quantum 입력에 대해 unitary operator와 동일하게 되기 때문이다. basis vector를 trivial한 basis vector $(\ket{0}, \ket{1}, ..., \ket{2^n -1})$로 생각해보자.

$\ket{0^n}$의 값을 제외한 나머지 basis들에 대해 phase를 $\pi$만큼 shift 시켜주는 것이다. global phase를 $-1$ 곱해주면 이는 $\ket{0^n}$만 $\pi$만큼 phase shift 시키고, 나머지는 가만히 냅두는 것과 같다. $C^{n-1}$-NOT gate를 이용하면 아래 그림과 같이 circuit을 구성하면 된다.

<center><img src="/assets/20210216_2.png" width="400" height="300"></center>

## Grover algorithm with an arbitrary phase

앞서 설명한 Grover algorithm은 $U_s = 2\ket{s}\bra{s} - I_n$와 같은 diffusion operator를 사용한다. 위에서는 이를 평면 위에서 벡터의 회전으로 해석했지만, 이번에는 외분점 개념으로 생각해보자. 어렸을 때, 선분의 외분점 공식을 배운적이 있을 것이다. 실수 선분 위에 서로 다른 두 점 $a, b$가 주어졌을 때, 다음 그림과 같은 외분점 $c$ 구하려면 $c = \frac{mb - na}{m-n}$ 식을 이용해 구할 수 있다.

<center><img src="/assets/20210216_3.png" width="400" height="300"></center>

diffusion operator도 자세히 보면 외분점을 구하는 공식과 같다. quantum state $\ket{\psi} \propto \sum_{k=0}^{2^n -1}x_k\ket{k}$에 대해 diffusion operator를 적용해보면, 아래 공식을 만족한다.

<center>$U_s\ket{\psi} = 2\ket{s}\bra{s}\ket{\psi} - \ket{\psi}$</center>

여기서 basis $\ket{k}$의 크기를 구하면 아래와 같다.

<center>$\bra{k}U_s\ket{\psi} = 2\bra{k}\ket{s}\bra{s}\ket{\psi} - \bra{k}\ket{\psi} = \frac{2}{N}(\sum_{i=0}^{2^n -1} x_i) - x_k$</center>

$M = \frac{1}{N}(\sum_{i=0}^{2^n -1} x_i)$라고 하면, 식은 아래와 같다.

<center>$2 \cdot M - x_k$</center>

이는 점 $M$과 $x_k$가 주어졌을 때, $2:1$ 외분점을 뜻한다. $x_k$가 1일 때와 -1 일 때 $M$에 대한 외분점이 달라지기 때문에 원하는 basis에 대한 amplitude를 키울 수 있게되는 것이다. 여기서 잠시 생각해보면, 외분점을 잘 조절해서 $x_k = 1$ 일 때, $(l+1) \cdot M - l \cdot 1 \approx 0$이 되도록 할 수 있지 않을까? 이러면 $O(\sqrt{N})$번 iteration을 돌릴 필요 없이 단 한 번의 oracle query만으로 해를 구할 수 있게 된다. 위 식을 만족하기 위해서는 $l = \frac{M}{1-M}$을 만족해야 한다. 가장 처음 iteration에서 $x_w = -1$이고 나머지는 다 1이므로 사실 $M = \frac{2^n -2}{2^n}$이다. 그러면 $l = 2^{n-1} -1$이다.

diffusion operator를 어떤식으로 변경해야 외분점 비율을 조금이라도 변경해볼 수 있을지 생각해보자. 기존의 diffusion circuit에서 아래와 같은 circuit으로 변경하면 비율을 $m:n = (1-e^{i\beta}) : 1$로 줄일 수 있다.

<center><img src="/assets/20210216_4.png" width="400" height="300"></center>

이를 논문에서는 $\beta$-phase diffusion transform이라고 한다. 하지만 $e^{i\beta} = -\frac{1}{l}$이 되려면, $M = \frac{2^n -2}{2^n}$에 대해서는 한 번의 query로 해를 찾을 수 있는 $\beta$가 존재하지 않는다.

이 부분을 보완하기 위해 $M$ 값을 바꾸는 방법을 사용할 것이다. oracle $O_f$ 대신에 phase $\gamma$만큼 변화시키는 $\gamma$-phase oracle을 이용하면 $M$ 값이 변화한다. $\gamma$-phase oracle을 적용하면 얻을 수 있는 quantum state는 아래와 같다.

<center>$U_{\gamma}\ket{\psi} = \sum_{x=0}^{2^n-1} (e^{i\gamma})^{f(x)}\ket{x}$</center>

여기서 $M$ 값은 $\frac{2^n -1 + e^{i\gamma}}{2^n}$이다. 이러면 $l = \frac{2^n -1 +e^{i\gamma}}{1-e^{i\gamma}}$이 되어야 한 번의 query로 해를 구할 수 있다. 그러면 $\beta$-phase diffusion transform을 사용한다고 했을 때, $e^{i\beta} = -\frac{1-e^{i\gamma}}{2^n -1 +e^{i\gamma}}$를 만족해야한다. 근데 이 식도 자세히 보면, 좌변의 norm은 1인데 비해, 우변의 norm은 $n$이 커질수록 exponential하게 작아짐을 알 수 있다. 이러면 $n$ 값이 조금만 커도 해당 식을 만족하는 $0 \leq \beta, \gamma < 2\pi$가 존재하지 않는다.

여기서 $f(x)=1$인 해의 개수가 오직 한 개라는 조건의 한계점을 느낄 수 있다. 만약 해의 개수가 $r$개라면, 식이 어떻게 변화할지 생각해보자. $M$은 아래와 같이 바뀐다.

<center>$M = \frac{2^n - r + r \cdot e^{i\gamma}}{2^n}</center>

그러면 한 번의 query로 해를 찾을 수 있는 $\beta$값은 아래 식으로 구할 수 있다.

<center>$e^{i\beta} = -\frac{r - r \cdot e^{i\gamma}}{2^n -r + r \cdot e^{i\gamma}} = -\frac{1 - e^{i\gamma}}{\frac{2^n}{r} -1 + e^{i\gamma}}$</center>

식을 다시 $f(x)=1$을 만족하는 해의 비율인 $x = \frac{r}{2^n}$ 값에 대해 정리하면 아래와 같다.

<center>$x = \frac{1}{e^{i(\gamma - \beta)} -e^{-i\beta} -e^{i\gamma} + 1} = \frac{1}{(1-e^{i\gamma})(1-e^{-i\beta})}$</center>

$\newcommand{\norm}[1]{\left| #1 \right|}$

$x$는 0이상 1이하 실수이므로, 이를 만족하기 위해서는 $\gamma = \beta$이어야 한다. 이런 경우, $x = \norm{\frac{1}{(1-e^{i\gamma})}}^2 \geq \frac{1}{4}$이다. 따라서 $f(x)=1$을 만족하는 해의 개수가 최소 ${2^n -2}$개는 되어야 한번의 query로 해를 찾을 수 있다. 이 때, $\beta = \gamma = \cos^{-1}(1-\frac{1}{2x})$이다.

### 알고리즘의 적용

[Quantum Security Analysis of CSIDH](https://eprint.iacr.org/2018/537.pdf)논문 21페이지로 잠시 돌아가면, CSIDH에 대한 oracle을 만들기 위해 Elliptic curve 위의 $l$-order point $P$를 구할 때, curve 위의 랜덤한 점 $P$를 uniform superposition state로 만들어 해당 점의 order가 $l$인 점 $P$를 구하는 Grover algorithm의 입력으로 넣어주는 상황을 생각해보자. 이 때, curve위의 임의의 점 중에서 order가 $l$인 점의 비율은 대략 $\frac{l-1}{l}$이다. 이는 어떤 $l$ 값에 대해서도 비율이 $1/4$를 넘으므로 한 번의 query로 Grover algorithm을 적용할 수 있는 상황이된다.

여기서 눈여겨 볼 점은 한 번의 query로 Grover algorithm을 수행하기 위해서는 phase shift gate를 구현해야한다는 것이다. 이는 [Quantum Security Analysis of CSIDH](https://eprint.iacr.org/2018/537.pdf)논문 22페이지에 아래와 같이 언급되어 있다.

 > For a phase shift gate synthesized from Clifford+T gates, we estimate from [28](https://arxiv.org/pdf/1206.5236.pdf) that it can be approximated up to an error of $2^{-50}$ using around $2^{14}$ T-gates, which is negligible compared to the cost of the exponentiation in the test function

 _[28](https://arxiv.org/pdf/1206.5236.pdf)논문은 읽어보는게 좋을 것 같다!_

 논문에서처럼 phase shift gate는 한 번 수행할 때마다 $2^{-50}$으로 매우 작은 실패 확률을 가지고 있고, Grover algorithm with a single query에서는 phase shift gate를 polynomial 횟수(대략 $n$번)만 사용하므로 에러는 무시할만한 수준으로 보인다.