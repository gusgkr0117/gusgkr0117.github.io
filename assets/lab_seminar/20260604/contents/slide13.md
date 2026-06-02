# Ample Line Bundle

Line bundle $L$ 위의 holomorphic sections가 충분히 많으면, 이 section들을 이용해서 공간 $X$를 projective space 안에 보낼 수 있다.

$$
x \mapsto [s_0(x):s_1(x):\cdots:s_n(x)]
$$

즉 line bundle은 projective embedding을 만들기 위한 coordinate functions를 제공한다.

Definition 1. (globally generated) A line bundle $L$ on $X$ is globally generated if for every point $x\in X$, there exists a global section $s\in H^0(X,L)$ such that
$$
s(x)\neq 0.
$$

Definition 2. (very ample line bundle) A line bundle $L$ on $X$ is very ample if its global sections define an embedding
$$
X \hookrightarrow \mathbb{P}(H^0(X,L)^{\vee}).
$$

Definition 3. (ample line bundle) A line bundle $L$ on $X$ is ample if some positive tensor power $L^{\otimes m}$ is very ample.

For an elliptic curve, a line bundle of degree $3$ is very ample and gives an embedding into $\mathbb{P}^2$.
