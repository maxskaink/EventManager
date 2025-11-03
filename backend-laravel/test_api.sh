#!/bin/bash

# Tokens para pruebas
TOKEN_MENTOR="1|aTo91UgBO4uCEPmD02wafmv4txXyccyxY9sHrT2le6b2342a"
TOKEN_COORDINATOR="2|El5aPJUaAKpEc89KU8yyNtNq9pkkOVQPYH0ZW4YU1c1ed506"
TOKEN_MEMBER="3|79W8iYzcmfJl9XsEMIwWl2kTbhAhbUWq6tCxazMS6b8464fc"
TOKEN_INTERESTED="4|EIe9AFr2zTUtIJlIkHtyeUuNFJdimqluxp49NSUF0d33999d"

BASE_URL="http://localhost/api"

echo "=========================================="
echo "PRUEBAS DE API - Backend Laravel"
echo "=========================================="
echo ""

# Test 1: Obtener usuario autenticado (Mentor)
echo "1. GET /api/user (Mentor)"
echo "----------------------------------------"
curl -s -X GET "$BASE_URL/user" \
  -H "Authorization: Bearer $TOKEN_MENTOR" \
  -H "Accept: application/json" | jq '.' 2>/dev/null || curl -s -X GET "$BASE_URL/user" -H "Authorization: Bearer $TOKEN_MENTOR" -H "Accept: application/json"
echo ""
echo ""

# Test 2: Obtener perfil
echo "2. GET /api/profile (Mentor)"
echo "----------------------------------------"
curl -s -X GET "$BASE_URL/profile" \
  -H "Authorization: Bearer $TOKEN_MENTOR" \
  -H "Accept: application/json" | jq '.' 2>/dev/null || curl -s -X GET "$BASE_URL/profile" -H "Authorization: Bearer $TOKEN_MENTOR" -H "Accept: application/json"
echo ""
echo ""

# Test 3: Listar usuarios activos
echo "3. GET /api/user/active (Mentor)"
echo "----------------------------------------"
curl -s -X GET "$BASE_URL/user/active" \
  -H "Authorization: Bearer $TOKEN_MENTOR" \
  -H "Accept: application/json" | jq '.' 2>/dev/null || curl -s -X GET "$BASE_URL/user/active" -H "Authorization: Bearer $TOKEN_MENTOR" -H "Accept: application/json"
echo ""
echo ""

# Test 4: Listar eventos
echo "4. GET /api/event/all (Coordinator)"
echo "----------------------------------------"
curl -s -X GET "$BASE_URL/event/all" \
  -H "Authorization: Bearer $TOKEN_COORDINATOR" \
  -H "Accept: application/json" | jq '.' 2>/dev/null || curl -s -X GET "$BASE_URL/event/all" -H "Authorization: Bearer $TOKEN_COORDINATOR" -H "Accept: application/json"
echo ""
echo ""

# Test 5: Listar certificados
echo "5. GET /api/certificate/all (Member)"
echo "----------------------------------------"
curl -s -X GET "$BASE_URL/certificate/all" \
  -H "Authorization: Bearer $TOKEN_MEMBER" \
  -H "Accept: application/json" | jq '.' 2>/dev/null || curl -s -X GET "$BASE_URL/certificate/all" -H "Authorization: Bearer $TOKEN_MEMBER" -H "Accept: application/json"
echo ""
echo ""

# Test 6: Listar artículos
echo "6. GET /api/article/all (Interested)"
echo "----------------------------------------"
curl -s -X GET "$BASE_URL/article/all" \
  -H "Authorization: Bearer $TOKEN_INTERESTED" \
  -H "Accept: application/json" | jq '.' 2>/dev/null || curl -s -X GET "$BASE_URL/article/all" -H "Authorization: Bearer $TOKEN_INTERESTED" -H "Accept: application/json"
echo ""
echo ""

echo "=========================================="
echo "PRUEBAS COMPLETADAS"
echo "=========================================="

