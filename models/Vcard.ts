import mongoose from 'mongoose';

const VcardSchema = new mongoose.Schema({
  vcardName: String,
  name: String,
  slug: String ,
  lastname: String,
  phone: String,
  altPhone: String,
  email: String,
  website: String,
  company: String,
  profession: String,
  summary: String,
  street: String,
  postal: String,
  city: String,
  state: String,
  country: String,
  facebook: String,
  instagram: String,
  zalo: String,
  whatsapp: String,
  image: String, // nếu lưu path ảnh
  welcomeImage: String,
  primaryColor: String,
  secondaryColor: String,
  socials: [String],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Vcard || mongoose.model('Vcard', VcardSchema);
