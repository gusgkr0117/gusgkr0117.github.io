---
title: Complete varieties
subtitle: Completeness 이해하기
tags: Mathematics
use_math: true
key: post_20260906
---

* Complete variety의 정의와 직관을 이해한다.
* 위상수학에서의 compact 개념과 일치한다.
* 실수, 복소수의 완비성 개념과도 유사하다.

<!--more-->

## Complete variety의 정의
어떤 variety $X$에 대해서 다른 모든 variety $Y$에 대해
Projective map $\pi : X\times Y \to Y$가 항상 closed map 이라면,
즉, $X\times Y$의 Zariski closed set $Z$에 대해, image $\pi(Z)$
가 $Y$에서 closed set이라면, $X$를 **Complete** variety라고 한다.

## 정의에 대한 해석
일반적으로 실수나 복소수에서는 metric을 먼저 정의해두고, 해당 metric에 따른 모든 코시 수렴이 (거리가 0에 수렴하는 수열) 항상 동일한 집합안에 존재함을 완비성이라고 한다. 즉, 모든 수열의 수렴값이 항상 같은 집합 내에 존재함을 의미한다.

Metric을 정의할 수 없는 Zariski topology의 경우에 완비성을 정의하려면 universal 한 특성으로 정의하게된다. 즉, 다른 모든 variety와의 관계로 completeness를 정의한다.

완비성의 직관을 생각해보자. 어떤 집합에 완비성을 부여하는 것은 수학의 각 분야에서 다르게 해석될 수 있으나 마치 하나의 직관처럼 느껴진다. 해석학의 완비성은 코시 수열의 비어있는 수렴값을 메우는 작업이다. 대수기하의 완비성은 곡선의 극한 점을 메우는 작업이다. 자연스럽게 있어야할 값을 존재하게 하는 작업이 완비성이다. 그런 의미에서 어떤 Field $K$가 있을 때, $K$를 algebraic closure로 확장하는 작업도 구멍을 메우는 작업이라고 할 수 있겠다.

분야는 다르지만 모두 같은 직관을 가진다. "자연스럽게 존재하는 값을 존재하게 만드는 작업". 이게 모두 같은 직관이라면 하나의 통합된 정의가 존재할까? 물론, 가능하다. Category theory를 활용하면 통합된 정의를 통해 설명할 수 있다. 하지만 쉬운 과정은 아니여서 여기서는 다루지 않고 추후에 Category theory를 활용한 완비성에 대해 포스팅하도록 하겠다.

여기서 중요한 직관은 Category theory를 통해서 어떤 특성을 정의할 땐, universal한 정의가 항상 사용된다는 것이다. 이러한 universal한 특성은 Complete variety의 정의에서도 볼 수 있다.

어떤 variety $X$의 구멍을 메운다는 것은 $X$에 존재하지 않는 어떤 새로운 공간 $Y$를 덧붙여서 원래는 존재하지 않았던 자명하지 않은 (V_X \times V_Y와 같은 형태가 아닌) subvariety가 생긴다는 뜻이다. 예를들면, $X = \mathbb{A}\_k^1$일 때, $Y = \mathbb{A}\_k^1$이라고 한다면, $X \times Y = \mathbb{A}\_{k}^2$이고 그 안에 닫힌 곡선 $xy - 1 = 0$을 생각하면, 이는 projection map에 의해서 닫힌 곡선으로 가지 않는다. 반대로 모든 $Y$에 대해서 항상 새로운 어떤 자명하지 않은 variety가 생성되지 않으면 $X$는 완비성을 갖는다고 말하는건 이제 자연스러워 보인다.