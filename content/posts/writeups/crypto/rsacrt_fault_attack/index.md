---
title: The Math Behind RSA CRT Fault Attack
description: Post explaining why the RSA Chinese Remainder Theorem (CRT) Fault Attack works
date: "2025-11-26"
draft: false
tags: [crypto,rsa,crt,fault-attack] 
toc: false
---

# RSA Chinese Remainder Theorem (CRT)

Let's start with the classic RSA signature scheme.

Suppose Alice wishes to send a signed message $m$ to Bob. She produces a hash value $h = hash(m)$ of the message $m$, raises it to the power of $d$ (modulo $n$), and attaches $s = h^d\ mod\ n$ as a "signature" to the message.

The $n$ is the product of two large prime numbers $p$ and $q$. The $d$ is the private key, which is the modular multiplicative inverse of $e$ modulo $\phi(n) = (p-1)(q-1)$.

Bob then uses the public key $(e, n)$ to verify the signature. He raises $s$ to the power of $e$ (modulo $n$) and checks if it equals $h$.

This classic scheme is very slow and is not much used in practice. Instead, the Chinese Remainder Theorem (CRT) is used to speed up the process.

The key idea is to use the Chinese Remainder Theorem to compute 

$$
s_{1} \equiv h^{d_{p}}\ mod\ p
$$
$$
s_{2} \equiv h^{d_{q}}\ mod\ q
$$

where $d_{p} = d\ mod\ p$ and $d_{q} = d\ mod\ q$.

Then the Chinese Remainder Theorem is used to combine them to get $s$ modulo $n$.

The CRT is crucial for further explanation of the attack, so let's define it.

## Chinese Remainder Theorem

Consider a system of linear congruences

$$
x \equiv a_1 \pmod{m_1}
$$
$$
x \equiv a_2 \pmod{m_2}
$$
$$
\vdots
$$
$$
x \equiv a_N \pmod{m_N}
$$

where $m_1, m_2, \dots, m_N \ge 2$ are pairwise coprime, i.e., $\gcd(m_i, m_j) = 1$ for all $i \neq j$.

A solution to this system always exists and all solutions are congruent modulo $M$ (thus in $\mathbb{Z}_M$ the solution is determined uniquely), where

$$
M = \prod_{i=1}^N m_i
$$

---

This can be practically be used in the following way:

1. For each $i \in \{1, 2, \dots, N\}$ define $M_i := \frac{M}{m_i}$
2. Compute $X_i$ such that $M_i X_i \equiv 1 \pmod{m_i}$, thus finding an inverse of $M_i$ in modulo $m_i$
3. We claim that the solution to the given system is
$$
x \equiv \sum_{i=1}^{N} a_i M_i X_i \pmod M
$$

# When Fault is Introduced

When a fault occurs while computing the $s_1$ or $s_2$ values, it can be smartly used to to recover the number $p$ (or $q$) and then the private key $d$.

Suppose that we have a correct signature $s$ that has been derived from:

$$
s_1 \equiv h^{d_p}\ mod\ p
$$
$$
s_2 \equiv h^{d_q}\ mod\ q
$$

So using the CRT steps defined above, we get a value of $s$ modulo $n$:

1.
$$
M_1 = \frac{n}{p} = q
$$
$$
M_2 = \frac{n}{q} = p
$$

2.
$$
X_1 \equiv M_1^{-1}\ mod\ p \equiv q^{-1}\ mod\ p
$$
$$
X_2 \equiv M_2^{-1}\ mod\ q \equiv p^{-1}\ mod\ q
$$

3.
$$
s \equiv \sum_{i=1}^{N} a_i M_i X_i \pmod M \equiv s_1 \cdot (q^{-1} \mod p) \cdot q + s_2 \cdot (p^{-1} \mod q) \cdot p \pmod n
$$

And suppose that we have a faulty signature $f$ that has been derived from:

$$
f_1 \equiv h^{d_p}\ mod\ p
$$
$$
f_2 \equiv h^{d_q}\ mod\ q
$$

And again using the CRT, we get a value of $f$ modulo $n$:

1.
$$
M_1 = \frac{n}{p} = q
$$
$$
M_2 = \frac{n}{q} = p
$$

2.
$$
X_1 \equiv M_1^{-1}\ mod\ p \equiv q^{-1}\ mod\ p
$$
$$
X_2 \equiv M_2^{-1}\ mod\ q \equiv p^{-1}\ mod\ q
$$

3.
$$
f \equiv \sum_{i=1}^{N} a_i M_i X_i \pmod M \equiv f_1 \cdot (q^{-1} \mod p) \cdot q + f_2 \cdot (p^{-1} \mod q) \cdot p \pmod n
$$

Let's say that the faulty computation appeared in the computation of $f_2$:

$$
f_1 \equiv h^{d_p}\ mod\ p
$$
$$
f_2 \not\equiv h^{d_q}\ mod\ q
$$

If we compute $s - f$, we get:

$$
s - f \equiv s_1 \cdot (q^{-1} \mod p) \cdot q + s_2 \cdot (p^{-1} \mod q) \cdot p - f_1 \cdot (q^{-1} \mod p) \cdot q - f_2 \cdot (p^{-1} \mod q) \cdot p \pmod n
$$

We know that $f_1 \equiv s_1 \pmod p$, however $f_2 \not\equiv s_2 \pmod q$. We use this to our advantage and substitute $f_1$ with $s_1$.

$$
s - f \equiv s_1 \cdot (q^{-1} \mod p) \cdot q + s_2 \cdot (p^{-1} \mod q) \cdot p - s_1 \cdot (q^{-1} \mod p) \cdot q - f_2 \cdot (p^{-1} \mod q) \cdot p \pmod n
$$

After simplification, we get:

$$
s - f \equiv s_2 \cdot (p^{-1} \mod q) \cdot p - f_2 \cdot (p^{-1} \mod q) \cdot p \pmod n
$$

And then:

$$
s - f \equiv (s_2 - f_2) \cdot (p^{-1} \mod q) \cdot p \pmod n
$$

## Light Bulb Moment

We came to a very interesting state, where we know from that equation that $s_2 - f_2$ is a multiple of $p$, can write $s_2 - f_2 \equiv 0 \pmod p$ or maybe even better $s_2 - f_2 = p \cdot k$ for some integer $k$.

This is the light bulb moment, when we can realise, that we are actually holding a $k$ multiple of $p$ in our hands. And we can know for sure, that $p$ is a divisor of $n$.

We can pretty easily compute (using Euclid's algorithm, note that computing GCD is a very fast routine operation, factoring is the hard part):

$$
gcd(s - f, n) = gcd(p \cdot k, n) = p
$$

## Easy to Compute the Rest

Now that we have $p$, we can compute $q$ as $q = \frac{n}{p}$.

And then we can compute $d$ as $d = e^{-1} \mod \phi(n)$.

# Resources

1. https://crypto.stackexchange.com/questions/63710/fault-attack-on-rsa-crt
2. https://www.cryptologie.net/posts/fault-attacks-on-rsas-signatures/
3. https://en.wikipedia.org/wiki/RSA_cryptosystem