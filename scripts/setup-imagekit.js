#!/usr/bin/env node

// scripts/setup-imagekit.js
// Complete setup script for ImageKit integration

const fs = require('fs');
const path = require('path');

console.log('🚀 ImageKit Integration Setup');
console.log('================================\n');

// Check if we have the ImageKit configuration
const envPath = '.env.local';
const envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';

const hasImageKitURL = envContent.includes('NEXT_PUBLIC_IMAGEKIT_URL=');
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;

console.log('📋 Current Configuration:');
console.log(`   Environment: ${isProduction ? 'Production' : 'Development'}`);
console.log(`   ImageKit URL configured: ${hasImageKitURL ? '✅ Yes' : '❌ No'}`);
console.log(`   .env.local exists: ${fs.existsSync(envPath) ? '✅ Yes' : '❌ No'}\n`);

// Check if components exist
const componentsExist = {
  loader: fs.existsSync('src/lib/imagekit.ts'),
  component: fs.existsSync('src/components/IKImage.tsx'),
  conversionScript: fs.existsSync('scripts/convert-to-ikimage.js')
};

console.log('🔧 Component Status:');
Object.entries(componentsExist).forEach(([key, exists]) => {
  console.log(`   ${key}: ${exists ? '✅ Installed' : '❌ Missing'}`);
});

const allComponentsReady = Object.values(componentsExist).every(Boolean);

if (!allComponentsReady) {
  console.log('\n❌ Some components are missing. Please run the full setup first.');
  process.exit(1);
}

console.log('\n🎯 Next Steps:');

if (!isProduction) {
  console.log('\n📝 For Development (local):');
  console.log('   • Images will serve from /public/assets/ (no ImageKit needed)');
  console.log('   • Run: npm run dev');
  console.log('   • Convert existing images: node scripts/convert-to-ikimage.js');
} else {
  console.log('\n🌐 For Production (Vercel):');
  console.log('   • Set environment variable:');
  console.log('     NEXT_PUBLIC_IMAGEKIT_URL=https://ik.imagekit.io/audiojones');
  console.log('   • Deploy: vercel --prod');
}

console.log('\n📁 ImageKit Folder Structure:');
console.log('   ik:/audiojones/');
console.log('   ├── icons/        (from /assets/Icons/)');
console.log('   ├── images/       (from /assets/AUDIO JONES WEBSITE IMAGES/)');
console.log('   ├── backgrounds/  (from /assets/Backgrounds/)');
console.log('   └── testimonials/ (from /assets/Client Testiomonials/)');

console.log('\n✨ Usage Examples:');
console.log('```tsx');
console.log('import IKImage from "@/components/IKImage";');
console.log('');
console.log('// Auto-routes to ImageKit in prod, local in dev');
console.log('<IKImage src="/assets/Icons/mic.svg" width={64} height={64} alt="Mic" />');
console.log('');
console.log('// For raw img tags');
console.log('import { getImageSrc } from "@/lib/imagekit";');
console.log('<img src={getImageSrc("/assets/Icons/mic.svg", 64)} alt="Mic" />');
console.log('```');

console.log('\n🔄 Convert Existing Images:');
console.log('   node scripts/convert-to-ikimage.js');
console.log('   git diff  # Review changes');
console.log('   git add -A && git commit -m "chore: convert to IKImage loader"');

console.log('\n🚀 Ready to deploy!');