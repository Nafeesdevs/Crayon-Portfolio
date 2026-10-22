import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema({ label: String, url: String }, { _id: false });
const skillSchema = new mongoose.Schema({ name: String, emoji: String, level: { type: Number, default: 80 } }, { _id: false });
const statSchema = new mongoose.Schema({ label: String, value: String }, { _id: false });

// Single document holding everything shown on the public site
const profileSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'Your Name' },
    role: { type: String, default: 'Full-Stack Developer' },
    location: { type: String, default: 'Chennai, India' },
    headline: { type: String, default: 'I build things for the web that feel alive.' },
    bio: {
      type: String,
      default:
        "I'm a developer who gets a little too excited about turning messy ideas into smooth, delightful products. I care about the small details, the edge cases everyone forgets, and shipping work people genuinely enjoy using.",
    },
    avatar: { type: String, default: '' },
    availability: { type: String, default: 'Open to new work & good problems' },
    openToWork: { type: Boolean, default: true },
    email: { type: String, default: 'hello@example.com' },
    phone: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
    socials: { type: [linkSchema], default: [] },
    skills: { type: [skillSchema], default: [] },
    stats: { type: [statSchema], default: [] },
    tools: { type: [String], default: [] },
    marqueeWords: { type: [String], default: [] },
    funFacts: { type: [String], default: [] },
  },
  { timestamps: true }
);

profileSchema.statics.getSingleton = async function getSingleton() {
  let doc = await this.findOne();
  if (!doc) doc = await this.create({});
  return doc;
};

export default mongoose.model('Profile', profileSchema);
