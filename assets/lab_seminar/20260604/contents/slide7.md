# Projective Embedding: Real Example

Projective embedding은 여러 함수값을 projective coordinate로 묶어서 만든다.
$$
p \mapsto [f_0(p):f_1(p):\cdots:f_n(p)].
$$

Real circle 위의 점은
$$
p(t) = (\cos t,\sin t)
$$
로 쓸 수 있다.

이때 함수
$$
f_0(t)=1,\qquad f_1(t)=\cos t,\qquad f_2(t)=\sin t
$$
를 사용하면
$$
t \mapsto [1:\cos t:\sin t] \in \mathbb{RP}^2
$$
라는 map을 얻는다.

첫 좌표가 항상 $1$이므로 affine chart에서는 원래 circle
$$
(\cos t,\sin t)
$$
를 그대로 보는 것과 같다.

즉 함수들이 점을 충분히 잘 구별하면, 그 함수값들이 embedding을 만든다.
