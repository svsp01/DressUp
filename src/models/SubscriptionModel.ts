import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: String, default: 'free' },
  creditLimit: { type: Number, default: 100 },
  usedCredit: { type: Number, default: 0 },
}, { timestamps: true });

const SubscriptionModel = mongoose.models.Subscription || mongoose.model('Subscription', subscriptionSchema);

export default SubscriptionModel;
