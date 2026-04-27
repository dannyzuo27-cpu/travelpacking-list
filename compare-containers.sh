#!/bin/bash

echo "========== test-scroll.html 容器层级 =========="
echo "body → .container → .weather-scroll-container → .weather-cards → .weather-card"
echo ""
echo ".container 样式："
grep "\.container {" test-scroll.html -A 6

echo -e "\n========== mobile.html 容器层级 =========="
echo "body → .page → .trip-info-card → .weather-scroll-container → .weather-cards → .weather-card"
echo ""
echo ".trip-info-card 样式："
grep "\.trip-info-card {" mobile.html -A 8

