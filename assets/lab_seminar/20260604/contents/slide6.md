# Main Question

Elliptic curve
$$
E = \mathbb{C}/\Lambda
$$
는 universal cover $\mathbb{C}$ 위에서 lattice $\Lambda$만큼 반복되는 점들을 하나로 identify해서 얻는다.

따라서 $E$의 한 점은 $\mathbb{C}$ 위에서 여러 표현을 가진다.
$$
z,\quad z+\lambda,\quad z+\lambda^{\prime} \qquad (\lambda,\lambda^{\prime} \in \Lambda)
$$
는 모두 같은 점을 나타낸다.

Question. 각 point가 정확히 하나의 representation을 갖는 ambient space $X$가 있을까?
또 그 공간 $X$ 안에서 elliptic curve $E$는 어떤 모습으로 나타날까?

첫 번째 후보는 우리가 시각적으로 떠올리는 real torus이다.
하지만 $\mathbb{R}^3$ 안의 donut 모양 torus는 $E$의 topological model일 뿐,
elliptic curve의 complex structure를 보존하는 holomorphic embedding은 아니다.

우리가 원하는 것은 단순한 topological picture가 아니라 holomorphic embedding이다.
즉 $E$를 어떤 projective space 안에 넣어서, complex analytic structure를 보존하면서 algebraic geometry의 대상으로 보고 싶다.

This leads to the question:
$$
E \hookrightarrow \mathbb{P}^n
$$
can we construct such a holomorphic embedding, and what functions define it?
