curl -s -X GET "https://comp3810sef-group24.onrender.com/cart/items" --cookie cookie.txt | powershell -Command "ConvertFrom-Json | ConvertTo-Json -Depth 10" & ^
curl -s -X POST "https://comp3810sef-group24.onrender.com/cart/items" -H "Content-Type: application/json" -d "{\"productId\":\"691b0fc142d100f864773d6d\",\"quantity\":1}" --cookie cookie.txt --cookie-jar cookie.txt | powershell -Command "ConvertFrom-Json | ConvertTo-Json -Depth 10" & ^
curl -s -X PUT "https://comp3810sef-group24.onrender.com/cart/items/691b0fc142d100f864773d6d" -H "Content-Type: application/json" -d "{\"quantity\":2}" --cookie cookie.txt --cookie-jar cookie.txt | powershell -Command "ConvertFrom-Json | ConvertTo-Json -Depth 10" & ^
curl -s -X GET "https://comp3810sef-group24.onrender.com/cart/items" --cookie cookie.txt | powershell -Command "ConvertFrom-Json | ConvertTo-Json -Depth 10" & ^
curl -s -X DELETE "https://comp3810sef-group24.onrender.com/cart/items/691b0fc142d100f864773d6d" --cookie cookie.txt --cookie-jar cookie.txt | powershell -Command "ConvertFrom-Json | ConvertTo-Json -Depth 10" & ^
del cookie.txt

