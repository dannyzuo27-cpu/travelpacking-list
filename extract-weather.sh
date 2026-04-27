#!/bin/bash

echo "========== test-scroll.html 的完整结构 =========="
echo "1. 样式："
grep -A 50 "weather-scroll-container {" test-scroll.html | head -60

echo -e "\n2. HTML："
grep -A 30 '<div class="weather-scroll-container">' test-scroll.html | head -35

echo -e "\n========== mobile.html 的完整结构 =========="
echo "1. 样式："
grep -A 50 "weather-scroll-container {" mobile.html | head -60

echo -e "\n2. HTML（动态生成，查看mobile.js）："
grep -A 15 "weatherHtml = '<div class=\"weather-scroll-container\">" mobile.js

