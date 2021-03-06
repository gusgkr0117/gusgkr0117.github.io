---
title: Montgomery Multiplication
subtitle: Montomery Multiplication 이해하기
tags: Mathematics
use_math: true
key: post_20210131
---

* Montgomery Multiplication은 모듈러 곱을 효율적으로 수행하는 알고리즘이다.
* $\mathbb{F}_p$ 상에서 곱은 대부분의 공개키 기반 암호에서 사용한다.(e.g. ECC, isogeny, lattice, ... etc)

<!--more-->

## 빠른 모듈러 곱의 철학

소수 $p$가 주어졌을 때, Modular Multiplication은 $a$와 $b$로부터 $a \cdot b \mod p$를 구하는 것을 말한다.
단순한 방법으로 $a \cdot b$를 수행하고 이 값이 $p$보다 작아질 때까지 $p$를 빼주면 된다.
조금 더 개선한 방법으로는 $0 \leq a \cdot b - k \cdot p < p$를 만족하는 k를 $[0,p)$ 구간에서 binary search 해주는 방법이 있겠다. 이는 대략 $O(\log p)$의 시간복잡도를 가진다.

Modular 곱셈에서는 modular $p$를 해주는 연산이 가장 오래걸린다. modular 연산에 걸리는 시간을 효율적으로 줄이는게 Modular Multiplication 연산을 빠르게 수행할 수 있는 방법이다.

그런데 이진수를 사용한다면, $p = 2^k$꼴인 $p$에 대해서는 modular 연산이 k개의 least significant bit를 남기고 지우는 행위와 같다는 것을 알 수 있다. 이는 AND 논리 연산으로 아주 간단히 구현할 수 있다. $p \& (2^k-1)$을 연산하면 되기 때문이다. 이러한 점에서 착안해 modular $p$연산을 modular $2^k$연산으로 변환하여 연산을 빠르게 수행하려는 것이 Montgomery Multiplication의 철학이다.

## Montgomery reduction

$a \cdot b$의 값을 $[0,p-1]$사이로 reduction 시킨다는 것은 수의 길이를 줄인다는 의미이다. 수의 길이를 줄이는 가장 빠른 방법은 당연히 right shift 연산을 통해 lsb를 버리는 방법이다. 그렇다면 right shift를 통해서 reduction 시킬 수 있는 상황이 존재할까?

right shift는 $2^k$로 나누는 연산이므로 $2^k$로 나누어서 $a \cdot b$를 얻을 수 있어야한다. 여기서 Montgomery form의 아이디어가 발생한다. 모듈러 곱 연산을 할 때마다 $2^k$로 나누는 연산을 해야만 하도록 만들기 위해서 우리는 $a$와 $b$로부터 $a \cdot b$를 얻는 것 대신에 $a \cdot 2^k$와 $b \cdot 2^k$로부터 $a \cdot b \cdot 2^k$를 얻도록 만들 것이다. 이러면 자연스럽게 $ a2^k \cdot b2^k$를 연산해준 다음 $2^k$를 다시 나누어줘야 한다. 이렇게 되면 이왕 $2^k$로 나눠주어야 하는 김에 right shift 연산으로 길이도 $\log p$로 줄여서 자연스럽게 $ab2^k$ 값이 $[0,p-1]$ 안에 들어오도록 만들 수 있다.

그래도 아직 충분하지 않다. 우리는 $T = (a2^k \mod p) \times (b2^k \mod p)$를 $R = 2^k$로 나누는 연산을 수행할 때, right shift 연산을 사용하고 싶은건데 $T$ 값은 밑에서 $k$ 비트 만큼이 모두 0이라는 보장이 없기 때문이다. $p$값을 적절히 더해줘서 $k$만큼의 lsb를 0으로 만들어주면 그제서야 right shift를 사용할 수 있다.

$p$를 $n$번 더해줘야 $T$ 값을 우리가 원하는 형태로 만들 수 있다고 하면, $T + np \equiv 0 \mod R$ 식을 만족하는 $n$을 찾아야한다. 식을 다시쓰면, 

<center>$n \equiv T \times (-1 \times p^{-1}) \mod R$</center>

이 된다. $p$는 고정되어 있으므로, $p' = ((-1 \times p^{-1}) \mod R)$은 미리 계산해서 저장해두면, $Tp' \mod R$만 계산하면 된다. 이 모듈러 곱은 AND 연산으로 간단히 수행될 것이다. $\lfloor (T + np)/R \rfloor$를 계산하면 크기 범위는 $[0, \lfloor (p-1)^2/R \rfloor + (p-1)]$이 될 것이다. $k = \lceil \log p \rceil$라고 하면, $R = 2^k \geq p-1$이므로, $\lfloor ((p-1)^2/R) \rfloor \leq (p-1)$가 된다. 정리하면, 아래와 같은 결론을 내릴 수 있다.

<center><b>$k \geq \lceil \log p \rceil$이면, $\lfloor (T + np)/R \rfloor$는 $[0, 2(p-1)]$ 범위 안에 들어온다.</b></center>

$k = \lceil \log p \rceil$일 때, $T \in [0, (p-1)^2]$을 입력 받아서 미리 계산해둔 $p' = ((-1 \times p^{-1}) \mod R)$를 이용해서 $n = (T \times p' \mod R)$을 계산하고, $T + np$를 $k$-right shift 해주면 $T$에 대한 montgomery reduction이 된다.

montgomery reduction을 통해 modular reduction을 수행한다면 곱셈 한번과 덧셈 한번만큼의 연산만 필요하기 때문에 앞서 생각한 binary search보다는 훨씬 많은 연산을 줄인다는 것을 알 수 있다.

이를 pseudo code로 표현하면 아래와 같다.

### Montgomery reduction algorithm

```
k = ceil(log p)
function REDC is
    input: Integers R=2^k and p with gcd(R, p) = 1,
           Integer p′ in [0, R − 1] such that NN′ ≡ −1 mod R,
           Integer T in the range [0, Rp − 1].
    output: Integer S in the range [0, p − 1] such that S ≡ TR^(-1) mod p

    n ← ((T mod R)p′) mod R
    t ← (T + np) / R
    if t ≥ p then
        return t − p
    else
        return t
    end if
end function
```
[wiki 참조](https://en.wikipedia.org/wiki/Montgomery_modular_multiplication)

## Multi-precision reduction

지금까지는 $R = 2^k$인 일반적인 경우를 생각했지만, 컴퓨터의 연산단위는 8-bit, 16-bit, 32-bit, 64-bit와 같이 고정되어 있다. 따라서 이에 맞게 연산을 해주는게 더 빠를 것이다. 대표적인 예로 8-bit인 경우, 8-bit 크기의 레지스터에서 곱셈 또는 덧셈 연산을 하면 자동적으로 $2^8$에 대한 모듈러 곱셈, 덧셈을 연산하게 된다.

그런데 앞에서 $k \geq \lceil \log p \rceil$ 조건이 있어야한다고 언급했는데 어떻게 $k$를 8, 16, 32, 64와 같은 값으로 줄일 수 있을까?

결국 우리가 구하고자 하는 값은 $\lfloor (T + np)/R \rfloor$이므로 레지스터 크기가 8일 때, $k = 8*l \geq \lceil \log p \rceil$꼴인 $k$를 선택해서 $2^8$로 나눠주는 연산을 $l$번 수행하면 된다. 아래와 같은 루틴을 수행한다.

1) $T+np \equiv 0 \mod 2^8$이 되는 $n \in [0, 2^8-1]$을 찾는다.<br>
2) $T+np$에 8-right shift를 취한다.<br>
3) 1), 2)를 $l-1$번 더 반복한다.

자세한 알고리즘은 아래와 같다.

### Multi-precision reduction algorithm

아래 알고리즘은 $k$-right shift를 마지막에 한 번에 수행하는 방식이다. 실제로 right shift를 수행하지 않고, 출력값을 복사할 때, $k$-bit 밀려서 복사하는 방식으로 수행한다. 따라서 연산량이 전혀 들지 않는다

```
B = 2^8 or 2^16 or 2^32
function MultiPrecisionREDC is
    Input: Integer p with gcd(B, p) = 1, stored as an array of m words,
           Integer R = B^r,     --thus, r = log_B(R)
           Integer p′ in [0, B − 1] such that pp′ ≡ −1 (mod B),
           Integer T in the range 0 ≤ T < Rp, stored as an array of r + m words.

    Output: Integer S in [0, p − 1] such that TR^(−1) ≡ S (mod p), stored as an array of m words.

    Set T[r + m] = 0  (extra carry word)
    for 0 ≤ i < r do
        --loop1- Make T divisible by Bi+1

        c ← 0
        n ← T[i] ⋅ p′ mod B
        for 0 ≤ j < m do
            --loop2- Add the low word of n ⋅ p[j] and the carry from earlier, and find the new carry

            x ← T[i + j] + n ⋅ p[j] + c
            T[i + j] ← x mod B
            c ← ⌊x / B⌋
        end for
        for m ≤ j ≤ r + m − i do
            --loop3- Continue carrying

            x ← T[i + j] + c
            T[i + j] ← x mod B
            c ← ⌊x / B⌋
        end for
    end for

    for 0 ≤ i ≤ m do
        S[i] ← T[i + r]
    end for

    if S ≥ p then
        return S − p
    else
        return S
    end if
end function
```

### Multi-precision multiplication algorithm

앞서 설명한 reduction을 이용해 실제 Montgomery 곱셈을 진행한다면 곱셈과 reduction을 하나로 합쳐야한다. 이 둘은 사실 따로 수행할 필요 없이 하나의 함수 안에 약간의 최적화로 수행할 수 있다.

```
B = 2^8 or 2^16 or 2^32
function MultiPrecisionREDC is
    Input: Integer p with gcd(B, p) = 1, stored as an array of m words,
           Integer R = B^r,     --thus, r = log_B(R)
           Integer p′ in [0, B − 1] such that pp′ ≡ −1 (mod B),
           Integer A in the range 0 ≤ A < p, stored as an array of m words.
           Integer B in the range 0 ≤ B < p, stored as an array of m words.

    Output: Integer S in [0, p − 1] such that ABR^(−1) ≡ S (mod p), stored as an array of m words.

    --initialize array T
    for 0 ≤ i < r + m do
    	T[i] = 0
    end for

    Set T[r + m] = 0  (extra carry word)

    for 0 ≤ i < r do
        --loop1- Make T divisible by Bi+1

        c ← 0
        n ← (T[i] + A[0] ⋅ B[i]) ⋅ p′ mod B
        for 0 ≤ j < m do
            --loop2- Add n ⋅ p to T

            x ← T[i + j] + n ⋅ p[j] + c
            T[i + j] ← x mod B
            c ← ⌊x / B⌋
        end for
        T[i + m] ← T[i + m] + c

        c ← 0
        for 0 ≤ j < m do
            --loop3- Add A ⋅ B[i] to T

            x ← T[i + j] + A[j] ⋅ B[i] + c
            T[i + j] ← x mod B
            c ← ⌊x / B⌋
        end for
        T[i + m] ← T[i + m] + c

        --assert- A ⋅ B[i] + n ⋅ p는 B^(m+1)을 넘지 않으므로 더 이상의 캐리가 발생하지 않는다.

    end for

    for 0 ≤ i ≤ m do
        S[i] ← T[i + r]
    end for

    if S ≥ p then
        return S − p
    else
        return S
    end if
end function
```

[visual studio c++ source code](https://github.com/gusgkr0117/Montgomery-Multiplication)
