#!/usr/bin/env node

import { spawn } from 'child_process'
import os from 'os'

// Function to get IP addresses
function getNetworkIPs() {
  const interfaces = os.networkInterfaces()
  const results = []

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip over internal and non-ipv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        results.push(iface.address)
      }
    }
  }

  return results
}

// Show network URLs
const port = 5173 // Must match port in vite.config.ts
const networkIPs = getNetworkIPs()

console.log('\n🚀 Starting development server...\n')

if (networkIPs.length > 0) {
  console.log('📱 Network URLs for mobile devices:')
  networkIPs.forEach((ip) => {
    console.log(`   http://${ip}:${port}`)
  })
  console.log('\n🔍 Use these URLs to access your site from mobile devices on the same network\n')
}

// Start the development server
const devProcess = spawn('remix', ['vite:dev'], {
  stdio: 'inherit',
  shell: true,
})

// Handle process exit
devProcess.on('close', (code) => {
  process.exit(code)
})
