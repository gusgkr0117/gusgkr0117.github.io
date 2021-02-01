---
title: Quantum algorithm for Hidden Shift Problem
tag: Quantum_Algorithm
use_math: true
---

* 해당 글은 [Quantum Security Analysis of CSIDH](https://eprint.iacr.org/2018/537.pdf)논문을 정리한 것이다.
* 3개의 대표적인 양자 알고리즘이 존재한다.
* kuperberg의 첫번째, 두번째 알고리즘과 Regev의 알고리즘이 존재한다.
* 입력으로 주어진 함수의 정의역 G가 commutative해야지 subexponential time 안에 문제를 해결할 수 있다.

### Hidden Shift Problem

 Hidden Shift Problem이란, group $G$와 집합 $A$에 대해서 함수 $f:G \rightarrow A$, $g:G \rightarrow A$가 존재해서 $f(x+s) = g(x)$를 만족할 때, shift 값 $s$를 찾는 문제이다.

 이 문제는 classical한 관점에서 봤을 때, collision을 찾는 문제와 같다. $n=\|G\|$라고 할 때, 걸리는 시간은 $\sqrt{n}$이 된다. 하지만 quantum 알고리즘으로는 subexponential하게 해결할 수 있다.

### kuperberg 알고리즘의 철학(labeled state)

함수 $f$와 $g$가 주어졌을 때, uniform superposition state를 $f$, $g$ oracle에 입력해서 우리가 가장 간단히 얻을 수 있는 quantum state는 아래와 같다.

<center>$\newcommand{\ket}[1]{\left| #1 \right>}$
$\ket{\psi_0} = \frac{1}{\sqrt{2N}}\sum_{x=0}^{N-1} \ket{x}(\ket{0}\ket{f(x)} + \ket{1}\ket{g(x)})$</center>

두번째 레지스터는 $f$ 또는 $g$ 중에서 어떤 함수의 출력값인지 0 또는 1로 구분하기 위해 넣은 ancilla 값이다. 위와 같은 quantum state에서 세번째 레지스터를 측정해서 얻은 label이 $v$라고 할 때, $f(x_0 + s) = g(x_0) = v$를 만족하는 $x_0$에 대해서 아래의 quantum state를 얻을 수 있다.

<center>$\ket{\psi_1} = \frac{1}{\sqrt{2}}(\ket{x_0 + s}\ket{0} + \ket{x_0}\ket{1})$</center>

여기서 두번째 레지스터에 Quantum Fourier Transform을 적용하면 아래의 quantum state를 얻는다.

<center>$\ket{\psi_2} = \frac{1}{\sqrt{2N}}\sum_{k=0}^{N-1} \ket{k}(\ket{0}+e^{2\pi ski/N}\ket{1})$</center>

여기서 다시 첫번째 레지스터를 측정하면 아래의 labeled quantum state를 얻을 수 있다.

<center>$\ket{\psi_l} = \frac{1}{\sqrt{2}}(\ket{0} + \chi(\frac{l}{N})\ket{1})$ where $\chi(x) = e^{2\pi sxi}$ </center>

labeled quantum state $\ket{\psi_l}$을 얻을 확률은 정확히 $\frac{1}{N}$이며, 한 개의 labeled quantum state를 얻기 위해서 $f$와 $g$ quantum oracle 각각에 대해 한번씩의 query가 필요하다.(총 두번의 query)

kuperberg 알고리즘은 이러한 labeled quantum state $\ket{\psi_l}$을 얻는 행위를 반복해서 충분히 많은 개수의 labeled quantum state를 모아놓고, 이들을 조합해서 아래의 labeled quantum state를 만드는 것이 목표이다.

<center>${\ket{\psi_{0}}, \ket{\psi_{1}}, ..., \ket{\psi_{2^k}}, ..., \ket{\psi_{2^{n-1}}}}$</center>

이와 같은 labeled quantum state를 얻으면, Quantum Fourier Transform을 역으로 적용해 shift 값 $s$를 얻을 수 있다.

### Combination Step

labeled quantum state $\ket{\psi_{l_1}}$과 $\ket{\psi_{l_2}}$가 주어졌을 때, 이 둘을 단순히 붙여놓으면 아래와 같은 quantum state를 얻을 수 있다.

<center>$\ket{\psi_{l_3}} = \frac{1}{2}(\ket{00} + \chi(\frac{l_1}{N})\ket{10} + \chi(\frac{l_2}{N})\ket{01} + \chi(\frac{l_1 + l_2}{N})\ket{11})$</center>

여기서 첫번째와 두번째 qubit에 CNOT을 적용하면 아래와 같은 quantum state를 얻을 수 있다.

<center>$\ket{\psi_{l_3}} = \frac{1}{2}(\ket{00} + \chi(\frac{l_1 + l_2}{N})\ket{10} + \chi(\frac{l_2}{N})\ket{01} + \chi(\frac{l_1}{N})\ket{11})$</center>

여기서 두번째 qubit을 측정하면 $\frac{1}{2}$확률로 label 0을 얻고, 아래와 같은 quantum state를 얻을 수 있다.

<center>$\ket{\psi_{l_1 + l_2}} = \frac{1}{\sqrt{2}}(\ket{0} + \chi(\frac{l_1 + l_2}{N})\ket{1})$</center>

이와 같은 방식으로 두개의 labeled quantum state를 이용해 combination된 새로운 labeled quantum state를 얻을 수 있다.

### kuperberg algorithm

위와 같은 방식으로 얻은 labeled quantum state를 2-valuation 값에 따라 분류할 것이다. $x$의 2-valuation이란, $x$가 $2^k$로 나누어 떨어지는 가장 큰 $k$ 값을 말한다.

$P_i = \\{ \ket{\psi_x} \| val_2(x) = i \\}$라고 하자. 그러면 아래와 같은 과정을 통해 원하는 labeled quantum state ${\ket{\psi_{2^i}}}$들을 얻을 수 있다.

```
for 0 ≤ i ≤ n do 
	pop a element e from P_i, put (e,i) in R.
	for (e,j) in R do:
		if val_2(e - 2^j) = i then
			pop A from P_i which maximize val_2(a + e -2^j)
			e = e + a
		end if
	end for

	if {(2^i, i) | 0 ≤ i ≤ n} in R then
		Apply QFT on the qubits, measure a t
		s ⟵ ⌈-Nt/2^(n+1)⌋ mod N
		return s
	end if

	while |P_i| ≥ 2 do
		pop two elements (a,b) of P_i which maximizes val_2(a+b)
		c = a+b
		Insert c in the corresponding P_(val_2(c))
	end while
end for
return Failure
```


$2^k + 1$개의 $n$-bit label이 uniform distribution으로부터 주어졌다고 가정하자. 그러면 비둘기 집의 원리에 의해 이중에서 $l_1 + l_2$의 2-valuation이 $k$ 이상이 되는 $l_1$, $l_2$가 적어도 1개 존재하며, 이 둘을 combination해서 2-valuation이 $k$ 이상이 되는 label 한개를 만들 수 있다. 따라서 만약에 $r \cdot 2^k$만큼의 $n$-bit label이 주어지면, 적어도 $\frac{(r-1)}{2} \cdot 2^k > \frac{r}{4} \cdot 2^k$만큼의 2-valuation이 $k$이상인 label을 얻을 수 있다.

그러면 가장 처음에 대략 $4^{\lceil \frac{n}{k} \rceil}2^k$만큼의 label을 뽑아놓으면 마지막에 2-valuation이 $n-1$인 label이 1개 이상 나온다는 것을 알 수 있다. $k = \sqrt{n}$으로 설정하면, 필요한 label의 개수는 총 $2^{3\sqrt{n}}$으로 subexponential하다. label의 개수는 곧 oracle query의 개수이므로 subexponential query만으로 문제를 해결 할 수 있음을 알 수 있다.

다만, 이를 위해서는 subexponential한 quantum memory가 필요하다는 것도 알 수 있다. 이는 상당한 자원을 필요로 한다.

### Approximate QFT

Group $G$의 크기를 $N$이라고 했을 때, 아래의 quantum state에 QFT를 적용한다.

<center>$\ket{\psi_1} = \frac{1}{\sqrt{2}}(\ket{x_0 + s}\ket{0} + \ket{x_0}\ket{1})$</center>

여기서 $s \in \mathbb{Z}/N\mathbb{Z}$ 이므로 임의의 $n \geq \log N$에 대해 일반적인 $2^n$-QFT를 적용하면 $N$이 power of 2가 아닐 경우엔 $\mathbb{Z}/N\mathbb{Z}$위의 덧셈을 구현하지 못한다. 따라서 정확히 $N$-QFT를 적용해주어야 정확한 $s$를 찾을 수 있으며, arbitrary order에 대한 approximate QFT는 [kitaev](https://arxiv.org/pdf/quant-ph/9511026.pdf)와 [Mosca and Zalka](https://arxiv.org/pdf/quant-ph/0301093.pdf) 논문을 참조하자.

해당 포스트에서는 $N$-QFT를 이용해도 우리가 앞서 얻은 label들

<center>${\ket{\psi_{0}}, \ket{\psi_{1}}, ..., \ket{\psi_{2^k}}, ..., \ket{\psi_{2^{n-1}}}}$</center>

을 통해서 얼마나 정확히 $s$값을 구해낼 수 있는가를 분석해볼 것이다. label을 생성할 때에는 $N$-QFT를 이용했지만, shift 값 $s$를 복구할 때에는 위 label들을 사용해야하기 때문에 $2^n$-QFT를 사용할 수 밖에 없다. 그러면 아래와 같은 quantum state를 얻을 수 있다.

<center>$\ket{\psi} = \frac{1}{2^{n/2}} QFT \sum_{k=0}^{2^n-1} \chi(\frac{ks}{N})\ket{k} = \frac{1}{2^n} \sum_{t=0}^{2^n-1} (\sum_{k=0}^{2^n-1} \chi(k(\frac{s}{N}+\frac{t}{2^n})))\ket{t}$</center>

이를 측정했을 때, label $t$를 얻을 확률은 $\frac{1}{2^{2n}}(\frac{1-\chi(2^n(\frac{s}{N}+\frac{t}{2^n}))}{1-\chi(\frac{s}{N}+\frac{t}{2^n})})^2$이 된다.

$\theta = \frac{s}{N}+\frac{t}{2^n}$라고 하면, $\theta = 0$인 $t$가 존재하면, 해당 $t$가 label로 측정될 확률은 1이되지만, N이 power of 2가 아닌 경우, 그런 $k$가 존재하지 않는다. $\theta \in [0, \frac{1}{2^{n+1}}]$인 경우, 확률값 $p(\theta) = \frac{1}{2^{2n}}(\frac{1-\chi(2^n\theta)}{1-\chi(\theta)})^2$는 단조 감소함을 알 수 있으며, $\theta = \frac{1}{2^{n+1}}$일 때, $p(\frac{1}{2^{n+1}}) \approx \frac{1}{2^{2n}}\frac{1/2}{(\pi\theta)^2} = \frac{2}{\pi^2}$값을 갖는다.

따라서 $\| \frac{s}{N} + \frac{t}{2^n} \| \leq \frac{1}{2^{n+1}}$를 만족하는 $t$를 찾을 확률이 적어도 $\frac{2}{\pi^2}$가 된다. 이러한 $t$ 값을 찾으면, $n > \log_2(N)$일 때, 연분수를 이용해 정확한 $s$ 값을 찾을 수 있다.

### Regev's algorithm with polynomial quantum space

내용이 길어지는 관계로 다음 포스팅에..