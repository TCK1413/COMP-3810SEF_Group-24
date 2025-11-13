#!/usr/bin/env bash

# ===== 配置区 =====
BASE_URL="http://localhost:8099"
COOKIE_FILE="cookie.txt"
PRODUCT_ID="691261028138ff9c9dcd0f38"   # ← 换成你的真实 product _id

pretty() {
  python3 -m json.tool
}

step() {
  echo
  echo "=================================================="
  echo "STEP $1: $2"
  echo "=================================================="
}

# ===== process start =====

# 0. init GET
step 0 "GET /cart/items  (initial cart)"
curl -s -X GET "$BASE_URL/cart/items" \
  --cookie "$COOKIE_FILE" --cookie-jar "$COOKIE_FILE" | pretty

# 1. POST – add product to cart
step 1 "POST /cart/items  (add product to cart)"
curl -s -X POST "$BASE_URL/cart/items" \
  -H "Content-Type: application/json" \
  -d "{\"productId\":\"$PRODUCT_ID\",\"quantity\":1}" \
  --cookie "$COOKIE_FILE" --cookie-jar "$COOKIE_FILE" | pretty

# 2. GET – check cart
step 2 "GET /cart/items  (after add)"
curl -s -X GET "$BASE_URL/cart/items" \
  --cookie "$COOKIE_FILE" --cookie-jar "$COOKIE_FILE" | pretty

# 3. PUT – update quantity to 3
step 3 "PUT /cart/items/:productId  (update quantity to 3)"
curl -s -X PUT "$BASE_URL/cart/items/$PRODUCT_ID" \
  -H "Content-Type: application/json" \
  -d '{"quantity":3}' \
  --cookie "$COOKIE_FILE" --cookie-jar "$COOKIE_FILE" | pretty

# 4. GET – check cart again
step 4 "GET /cart/items  (after update)"
curl -s -X GET "$BASE_URL/cart/items" \
  --cookie "$COOKIE_FILE" --cookie-jar "$COOKIE_FILE" | pretty

# 5. DELETE – delete product from cart
step 5 "DELETE /cart/items/:productId  (remove item)"
curl -s -X DELETE "$BASE_URL/cart/items/$PRODUCT_ID" \
  --cookie "$COOKIE_FILE" --cookie-jar "$COOKIE_FILE" | pretty

# 6. GET – check cart
step 6 "GET /cart/items  (final cart, should be empty)"
curl -s -X GET "$BASE_URL/cart/items" \
  --cookie "$COOKIE_FILE" --cookie-jar "$COOKIE_FILE" | pretty

echo
echo "🎉 Cart RESTful CRUD demo finished."

