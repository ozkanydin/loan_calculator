# Kredi Hesaplama Uygulaması

Modern ve kullanıcı dostu arayüzü ile kredi hesaplamalarınızı kolayca yapabileceğiniz bir mobil uygulama. Kredi tutarı, faiz oranı ve vade süresini girerek detaylı ödeme planınızı anında görüntüleyebilirsiniz.

## Özellikler

- Güvenli PIN korumalı giriş sistemi
- Anlık kredi hesaplama
- Detaylı ödeme planı görüntüleme
- Modern ve kullanıcı dostu arayüz
- Geçmiş hesaplamaları saklama ve görüntüleme
- Otomatik tema desteği
- Gelişmiş kullanıcı etkileşimleri

## Kullanılan Teknolojiler

- React Native (Expo) v52.0.32
- TypeScript
- React Navigation
- Expo Secure Store
- AsyncStorage
- React Native Reanimated
- Expo Blur
- React Native Gesture Handler

## Kurulum

1. Projeyi bilgisayarınıza indirin:
```bash
git clone https://github.com/ozkanydin/kredi_hesaplama.git
cd loan_calculator
```

2. Gerekli paketleri yükleyin:
```bash
npm install
```

3. iOS geliştiricileri için ek adım:
```bash
cd ios && pod install && cd ..
```

## Başlatma

1. Geliştirme ortamını başlatın:
```bash
npm start
```

2. Tercih ettiğiniz platformda çalıştırın:
- iOS Simulator için: i
- Android Emulator için: a
- Web versiyonu için: w

## Proje Yapısı

```
loan_calculator/
├── app/
│   ├── components/      # Bileşenler
│   ├── constants/       # Sabitler ve tema
│   ├── screens/         # Ekranlar
│   └── services/        # Servisler
├── assets/             # Medya dosyaları
└── ...
```

## Güvenlik Özellikleri

- 4 haneli PIN ile güvenli giriş sistemi
- Şifreli veri saklama
- Güvenli veri yönetimi

## Kullanım Kılavuzu

1. Uygulamayı ilk açtığınızda 4 haneli bir PIN oluşturun
2. Ana ekranda kredi bilgilerini girin:
   - Kredi tutarı
   - Yıllık faiz oranı
   - Vade süresi
3. Hesapla butonuna basın
4. Sonuçları inceleyin ve isterseniz kaydedin
5. Geçmiş hesaplamalarınıza alt menüden ulaşın

## Teknik Özellikler

### Hesaplama Ekranı
- Slider ile kolay veri girişi
- Gerçek zamanlı doğrulama
- Kapsamlı sonuç görüntüleme
- Hesaplama kaydetme

### Geçmiş Ekranı
- Kaydırarak silme
- Detaylı görüntüleme
- Kronolojik sıralama
- Yenileme özelliği

## Teknik Detaylar

- Minimum kredi tutarı: 1.000 TL
- Maksimum kredi tutarı: 10.000.000 TL
- Vade aralığı: 1-360 ay
- Faiz oranı aralığı: %0,1 - %100
- Maksimum kayıt sayısı: 50

## Önemli Bilgiler

- Uygulama Türkçe dil desteği ile geliştirilmiştir
- Tüm hesaplamalar Türk Lirası üzerinden yapılmaktadır
- Hesaplamalar aylık eşit taksit prensibine göre yapılmaktadır
- Hesaplama geçmişi cihaz üzerinde güvenli bir şekilde saklanır

