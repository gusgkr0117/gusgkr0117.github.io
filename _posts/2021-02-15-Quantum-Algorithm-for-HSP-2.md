---
title: Quantum algorithm for Hidden Shift Problem#2
subtitle: Regev의 HSP 알고리즘과 Collimation Sieve 이해하기
tag: Quantum_Algorithm
use_math: true
---

* 해당 글은 [Quantum Security Analysis of CSIDH](https://eprint.iacr.org/2018/537.pdf)논문을 정리한 것이다.
* Regev의 알고리즘은 2008년도 [A Subexponential Time Algorithm for the DHSP with Polynomial Space](https://arxiv.org/pdf/quant-ph/0406151.pdf) 논문을 참조
* Quantum algorithm for HSP 2편

$\newcommand{\ket}[1]{\left| #1 \right>}$
$\newcommand{\bra}[1]{\left< #1 \right|}$
$\newcommand{\norm}[1]{\left| #1 \right|}$
$\newcommand{\inner}[1]{\left< #1 \right>}$
$\newcommand{\ceil}[1]{\lceil #1 \rceil}$
$\newcommand{\floor}[1]{\lfloor #1 \rfloor}$

## Regev's algorithm with polynomial quantum space

Kuperberg가 처음 제안했던 알고리즘은 subexponential만큼의 quantum space를 필요로 한다는 단점이 있다. Kuperberg의 combination 방법은 $\frac{1}{2}$ 확률로 실패하기 때문에 $k$개의 labeled state를 결합한다면, 성공 확률은 $\frac{1}{2^{k-1}}$로 줄어든다. 따라서 두개씩만 골라서 2-valuation을 높일 수 있어야하기 때문에 저장공간을 많이 필요로 한다.

Regev는 이러한 단점을 보완하여 여러개의 labeled state를 결합할 수 있는 양자 알고리즘을 제안했다. 물론 Regev의 결합 방법도 실패 확률이 존재하지만, 이는 결합하려는 labeled state의 개수와는 상관 없이 constant 확률을 가지므로 quantum space를 절약할 수 있다.

Regev의 combination 연산은 $l+4$ 개의 labeled state를 입력으로 받아서 $l$ 개의 lsb가 0인 새로운 labeled state를 만든다.

### Combination step

아래와 같은 $l+4$ 개의 labeled state가 주어졌다고 가정하자.

<center>$\ket{0} + \chi(\frac{y_j}{N})\ket{1}, j=1,...,l+4$</center>

이를 모두 tensor product하면 아래와 같은 quantum state를 얻을 수 있다.

<center>$\ket{\psi_0} = \sum_{\vec{v} \in \{0,1\}^{l+4}} \chi(\frac{\inner{\vec{v}, \vec{y}}}{N})\ket{\vec{v}}$<br> where $\vec{y} = (y_1, y_2, ..., y_{l+4})$</center>

여기서 첫번째 레지스터에 $\ket{\vec{v}}\ket{0} \rightarrow \ket{\vec{v}}\ket{(\inner{\vec{v}, \vec{y}} \mod 2^l)}$연산을 적용하면, 아래와 같은 quantum state를 얻을 수 있다.

<center>$\ket{\psi_1} = \sum_{\vec{v} \in \{0,1\}^{l+4}} \chi(\frac{\inner{\vec{v}, \vec{y}}}{N})\ket{\vec{v}}\ket{\inner{\vec{v}, \vec{y}} \mod 2^l}$</center>

여기서 두번째 레지스터를 측정하면 label $V$를 얻고, 아래와 같은 quantum state를 얻는다.

<center>$\ket{\psi_2} = \sum_{\inner{\vec{v}, \vec{y}} \equiv V \mod 2^l} \chi(\frac{\inner{\vec{v}, \vec{y}}}{N})\ket{\vec{v}}$</center>

$\inner{\vec{v}, \vec{y}} \equiv V \mod 2^l$를 만족하는 $\vec{v}$는 subset sum 문제를 classical하게 풀어서 모든 solution을 구할 수 있다.(이 부분에서 kuperberg의 subexponential한 저장공간을 classical 연산으로 해결한다고 볼 수 있다.) 이는 brute-force 방법으로 $O(2^l)$만큼의 시간복잡도를 가진다. $V$ 값은 총 $2^l$개 이고, $\vec{v} \in \\{0,1\\}^{l+4}$의 값은 총 $2^{l+4}$개 이므로, 평균적인 해의 개수는 $m = 4$이다.

 이 solution들을 $\vec{v}_1, ... , \vec{v}_m \in \\{0,1\\}^{l+4}$라고 하자. 그러면 $\vec{v}_1, \vec{v}_2$로 span되는 subspace에 대한 projective measurement를 수행할 수 있다. basis $\vec{v}_1, ... , \vec{v}_m$에 대해서 amplitude의 크기가 1로 같으므로, 원하는 state를 얻을 확률은 $\frac{2}{m} = \frac{2}{4} = \frac{1}{2}$이며, 아래와 같은 quantum state를 얻는다.

 <center>$\ket{0} + \chi(\frac{\inner{(\vec{v}_2 - \vec{v}_1), \vec{y}}}{N})\ket{1}$</center>

$\inner{(\vec{v}_2 - \vec{v}_1), \vec{y}} \equiv 0 \mod 2^l$이 보장되므로, 2-variation은 $l$ 이상인 새로운 labeled quantum state를 얻는다.

### Time Complexity of Regev's algorithm

$n = \ceil{\log N}$이라고 할 때, $l = O(\sqrt{n \log n})$으로 잡으면, **<font color='red'>$k = O(\sqrt{n/\log n})$에 대해 $lk = O(n)$만큼의 저장공간만 필요로 한다는 것을 알 수 있다.</font>** 이 때, classical한 연산의 시간복잡도는 $O(2^l) = 2^{O(\sqrt{n \log n})}$이다. 또한, 필요한 labeled quantum state의 수(=필요한 query의 수)는 $l^k = 2^{O(\sqrt{n \log n})}$이다. Kuperberg의 query 수랑 비교했을 때 약간 더 많음을 알 수 있다.

만약에 $l = n$으로 잡으면, $k = 1$이 되어, 필요한 query 개수는 $n$개가 된다. 이러면 polynomial query 안에 문제를 해결할 수 있게된다. 하지만 여기서 함정은 classical한 연산을 $O(2^n) = O(N)$만큼 해야한다는 점이다. 이는 단순히 Hidden Shift 문제를 classical하게 해결하는 것과 같다. 

논문에서는 이 문제를 최적화된 classical 알고리즘을 적용해 $\tilde{O}(2^{0.291 \log_2(N)})$으로 해결함으로써 CSIDH-512가 NIST 기준에 맞지 않게됨을 보이고있다. **<font color='red'>이 의미는 결국 Classical한 측면에서 Hidden Shift Problem을 Subset Sum Problem으로 quantum reduction시켰다는 것이다.</font>** Subset Sum에 대한 최적화된 해결방법이 있으므로 이를 통해 Hidden Shift Problem를 우회적으로 짧은 시간 안에 해결하게 된다.

CSIDH-512의 경우에 Class Group의 크기가 대략 $N \approx \sqrt{p} = 2^{256}$이며, $l = 256$에 대한 Regev algorithm을 적용하면 $2^{19}$만큼의 quantum query가 필요하며, $2^{86}$만큼의 classical time과 memory가 필요하다는 결론이 나온다.

## Kuperberg's second algorithm(Collimation Sieve)

* 이 알고리즘은 2010년도 [Another subexp quantum algorithm for DHSP](https://arxiv.org/pdf/1112.3333.pdf)를 참조
* 이 알고리즘은 Collimation Sieve라고 불림

Kuperberg의 두번째 알고리즘도 여러 개의 labeled quantum state를 한번에 combination하는 방법을 사용한다. 다만 방식이 조금 다르다. labeled quantum state의 list를 만들어 list끼리 combination 해서 lsb를 지우는 방법을 사용한다. 이 알고리즘도 combination 과정에서 classical algorithm이 사용된다. 여기서는 subset sum 문제를 풀지 않고, 두 개의 list에서 matching을 찾는 문제를 풀어야한다. 이 또한 exponential 수준의 classical time을 필요로한다.

Collimation Sieve나 Regev의 알고리즘이나 중요한 철학은 classical 자원을 어떻게 최대한으로 이용해서 quantum space 또는 quantum time을 줄일 것이냐 하는 것이다. Regev의 알고리즘은 quantum space를 polynomial하게 줄였다.

Kuperberg가 Collimation Sieve를 제시하면서 주장하는 것은 classical 자원을 활용해서 quantum time도 polynomial하게 줄일 수 있다는 것이다. 물론 quantum space도 여전히 polynomial하게 유지할 수 있다. 그런데 여기서 개인적인 의문점은 앞서 설명한 것처럼 Regev의 알고리즘도 classical한 자원을 exponential하게 활용해서 quantum time을 polynomial하게 줄일 수 있음을 보였다. 따라서 Collimation Sieve가 Regev의 알고리즘보다 어떤 점이 더 좋은건지 아직은 이해가 잘 가지 않는다..

Collimation Sieve는 아래와 같은 labeled list를 사용한다.



### Combination Step of Collimation Sieve

