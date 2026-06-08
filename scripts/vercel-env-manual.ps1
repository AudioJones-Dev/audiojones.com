# Vercel Environment Variables Setup Guide
# Run these commands one by one to set up your environment variables

Write-Host "🚀 Vercel Environment Variables Setup" -ForegroundColor Green
Write-Host "Run these commands one by one:`n" -ForegroundColor Yellow

# Firebase Project ID
Write-Host "1. Set Firebase Project ID:" -ForegroundColor Cyan
Write-Host 'vercel env add FIREBASE_PROJECT_ID production' -ForegroundColor White
Write-Host "   Enter: audiojoneswebsite`n"

# Firebase Client Email  
Write-Host "2. Set Firebase Client Email:" -ForegroundColor Cyan
Write-Host 'vercel env add FIREBASE_CLIENT_EMAIL production' -ForegroundColor White
Write-Host "   Enter: firebase-adminsdk-fbsvc@audiojoneswebsite.iam.gserviceaccount.com`n"

# Firebase Private Key (the critical one)
Write-Host "3. Set Firebase Private Key (CRITICAL - this fixes the truncation issue):" -ForegroundColor Red
Write-Host 'vercel env add FIREBASE_PRIVATE_KEY production --sensitive' -ForegroundColor White
Write-Host "   Copy and paste the ENTIRE private key from below:" -ForegroundColor Yellow
Write-Host "-----BEGIN PRIVATE KEY-----" -ForegroundColor Gray
Write-Host "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCaRjnF8/YxaqFB" -ForegroundColor Gray
Write-Host "UyllYC3EkDprjUikwAoV5YpWxqdRFxpvW6MoKTEwzhBvCAC4vzaaTis0sb3mMsBR" -ForegroundColor Gray
Write-Host "LU1ZuOTFknb8IlS/hU74NGA4GiNSxRnjFIgTRtGAJGd4AJt+LlkRAeQIyTQa7T0g" -ForegroundColor Gray
Write-Host "i8jfe0kjCHN9pJBbCg11JLchnPRYyaR4lxpIlrZjqu1Gna5JlR6ljWUpCRR348x8" -ForegroundColor Gray
Write-Host "SiF05YCgosUpagv5eocFra4WrYCvGfncR2GuXAfvYgDN+7C5QSg6GMzLzOJQKBxU" -ForegroundColor Gray
Write-Host "0vrU2Ezwo6KfFgCyMr7xsVGARBrsJVT3b3TXonmTWdpSvX0oL925ldT6yU5abY21" -ForegroundColor Gray
Write-Host "A4Chl/kjAgMBAAECggEABIrv1ZIqZVX5ZJqKXAMMOD8E+oHqKgvCco2dRiUBfmiR" -ForegroundColor Gray
Write-Host "iOsxOKZOcAD3EaFWoBoJ4O0qwYdAVFK+G7OJS+f6gbKNB6t4jc7jB54iocH+IiO7" -ForegroundColor Gray
Write-Host "y8QOpf6px1BB921slG4+hZZTmCXHbVvWknOyIiw8QQPneh635lLyPYAHDeLUM2Xp" -ForegroundColor Gray
Write-Host "fU5nq3TrUw559xrxZFlxIWIhnQwLJnhvDQxF7aJeKEJ0UnyXRoJd0pJJIoqjV3a9" -ForegroundColor Gray
Write-Host "45MBQGtS54G+9dkNJU8Pzfw2N/KGLGSrC6VX1Z/IL0ZVxCDshDAInScu4444UXSP" -ForegroundColor Gray
Write-Host "fAyEJ5Hrm20t0E3hqzimodZ04M66j2bq3ce9/TVK3QKBgQDNb7BmzeWIrIPWi6f6" -ForegroundColor Gray
Write-Host "RgqaAeCM1f+q4MxK2h9O0ek66xcWOKh3k8Pb0N882LvLvw41CzIV34jGgzqwzxBt" -ForegroundColor Gray
Write-Host "yYfhoKrU69uzsT/P7d6BKQ1+w3KpAPkP4LwY9IPZqoTIMb2jC1E/tYLSekzYik3n" -ForegroundColor Gray
Write-Host "NX1B6Z5H0YwkLyUSkyKWl5opnQKBgQDAPuDUVvn/nsoEc1/9iv8lPBBIEH0EGJn7" -ForegroundColor Gray
Write-Host "PDSkgNC7RiCPsESShHFZaZIYBkSJzRRpO1sPG7zIuhRH0MCyxBvc6aWoQmOSzo1o" -ForegroundColor Gray
Write-Host "b7wPh9rmtekxT1/uq+LsSp6XOV4yaY6ecfM39H01nGjqgPvJ/i1ws0XY7iA+egl/" -ForegroundColor Gray
Write-Host "4bvgaLWRvwKBgQChJljY+/BvOuycUqbtAx5z2r8bmw7YK0j1+o6OlMkAp8NPchhs" -ForegroundColor Gray
Write-Host "3KPJ/dnv8A+4buGlKGgckmHHXs+ePH+lr24AxrjbFz0bgxIMeIqPBPYKFyUNf67g" -ForegroundColor Gray
Write-Host "DqleZgg7qbBJHgOlL06HzEmX88nuHuenU+Uy3CCGM9Fb3QOWw4ZhXQDYXQKBgHmq" -ForegroundColor Gray
Write-Host "UZeQw/7me2t9qQ5I3VivPo6dAMGK4EiDvb0uWOtsYkcNgxhHAYVYrsDNlqqvQ2+l" -ForegroundColor Gray
Write-Host "xOc24q8WNKeOkaWRPyD8LX7jJSlP12Z08EvT6tF/5ujyFwBxf9eTEfMat2aoLz5P" -ForegroundColor Gray
Write-Host "V2HeNS+soSloH/GiDxf4HQhBC97+VOy9660GF4L5AoGAeI+j3uAgqMTYxVUnFS7u" -ForegroundColor Gray
Write-Host "RmBJK6dwFL911sgkangUcHLf66WeWO/evgsGvpptiLtd14bf2gW8RTLsCPVxsBzD" -ForegroundColor Gray
Write-Host "4pwxs0WvBXVexYTsOp8pNn5RXWg6hhXEgCd8FXTT0HMmfAAEvR/FZU6PV8kQFnFQ" -ForegroundColor Gray
Write-Host "0kZNtFLhst4yY5vOzDnX8JY=" -ForegroundColor Gray
Write-Host "-----END PRIVATE KEY-----`n" -ForegroundColor Gray

Write-Host "🎯 CRITICAL SUCCESS METRIC:" -ForegroundColor Red
Write-Host "After setting FIREBASE_PRIVATE_KEY, run this to verify it's NOT truncated:" -ForegroundColor Yellow
Write-Host 'vercel env ls production | findstr FIREBASE_PRIVATE_KEY' -ForegroundColor White
Write-Host "The key should be ~1678 characters, NOT 40!`n" -ForegroundColor Red

Write-Host "✅ After all variables are set:" -ForegroundColor Green
Write-Host "- Vercel will auto-redeploy in 2-3 minutes" -ForegroundColor Blue