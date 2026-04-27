#!/bin/bash

echo "=== test-scroll.html 的容器结构 ==="
grep -A 3 '<div class="container">' test-scroll.html

echo -e "\n=== mobile.html 里 tripInfoCard 的父容器 ==="
grep -B 10 'id="tripInfoCard"' mobile.html | tail -15

echo -e "\n=== test-scroll.html 的 CSS ==="
grep "\.container {" test-scroll.html -A 5

echo -e "\n=== mobile.html 的 .trip-info-card CSS ==="
grep "\.trip-info-card {" mobile.html -A 7
