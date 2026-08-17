const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables from .env.local
try {
  const envPath = path.join(__dirname, '../.env.local')
  const envContent = fs.readFileSync(envPath, 'utf8')
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const value = match[2].trim().replace(/^["']|["']$/g, '')
      process.env[key] = value
    }
  })
} catch (error) {
  console.error('Error loading .env.local:', error.message)
}

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ypmhmnxnaovsixwdmhch.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY environment variable is required')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function deleteDoors() {
  console.log('Deleting existing door products...\n')
  
  const { data, error } = await supabase
    .from('products')
    .delete()
    .eq('category', 'Doors')
    .select()
  
  if (error) {
    console.error('Error deleting door products:', error)
    return 0
  }
  
  console.log(`✓ Deleted ${data.length} door products\n`)
  return data.length
}

const doorsDir = path.join(__dirname, '../public/New folder/Doors')

async function uploadImageToSupabase(filePath, fileName) {
  const fileBuffer = fs.readFileSync(filePath)
  const fileExt = path.extname(fileName)
  const baseName = path.basename(fileName, fileExt)
  const storagePath = `doors/${baseName}${fileExt}`
  
  console.log(`Uploading ${fileName} to Supabase Storage...`)
  
  const { data, error } = await supabase.storage
    .from('products')
    .upload(storagePath, fileBuffer, {
      contentType: 'image/jpeg',
      upsert: true
    })
  
  if (error) {
    console.error(`Error uploading ${fileName}:`, error)
    return null
  }
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('products')
    .getPublicUrl(storagePath)
  
  console.log(`✓ Uploaded: ${fileName} -> ${publicUrl}`)
  return publicUrl
}

async function createMaterial(imageUrl, index) {
  const material = {
    name: `Door ${index + 1}`,
    description: 'High-quality door suitable for residential and commercial buildings. Durable construction with excellent security features. Available in various designs to match your architectural style.',
    price: 800.00,
    unit: 'piece',
    category: 'Doors',
    images: [imageUrl],
    stock: 15
  }
  
  const { data, error } = await supabase
    .from('materials')
    .insert(material)
    .select()
    .single()
  
  if (error) {
    console.error(`Error creating material for ${imageUrl}:`, error)
    return null
  }
  
  console.log(`✓ Created material: ${material.name} (ID: ${data.id})`)
  return data
}

async function importDoors() {
  console.log('Starting import of doors...\n')
  
  // Delete existing door products from products table
  await deleteDoors()
  
  const files = fs.readdirSync(doorsDir)
    .filter(file => file.endsWith('.jpeg') || file.endsWith('.jpg') || file.endsWith('.png'))
    .filter(file => !file.startsWith('.'))
  
  console.log(`Found ${files.length} images to process\n`)
  
  let successCount = 0
  let failCount = 0
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const filePath = path.join(doorsDir, file)
    
    try {
      const imageUrl = await uploadImageToSupabase(filePath, file)
      
      if (imageUrl) {
        const material = await createMaterial(imageUrl, i)
        if (material) {
          successCount++
        } else {
          failCount++
        }
      } else {
        failCount++
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error)
      failCount++
    }
    
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  console.log(`\nImport complete: ${successCount} successful, ${failCount} failed`)
}

importDoors().catch(console.error)