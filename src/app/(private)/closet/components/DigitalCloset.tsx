'use client'
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Plus, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ClothingItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  type: string;
  color: string;
  season: string;
}

const categories = ['Men', 'Women', 'Unisex', 'Kids'];
const types = ['Shirt', 'T-Shirt', 'Pants', 'Dress', 'Skirt', 'Jacket', 'Shoes', 'Accessory'];
const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White', 'Gray', 'Purple', 'Pink', 'Orange'];
const seasons = ['Spring', 'Summer', 'Autumn', 'Winter', 'All-Season'];

const ClothingItem: React.FC<{ item: ClothingItem; onEdit: (item: ClothingItem) => void }> = ({ item, onEdit }) => (
  <motion.div
    layout
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    whileHover={{ scale: 1.05 }}
    className="bg-gray-800 rounded-lg overflow-hidden shadow-lg m-2 w-48"
  >
    <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
    <div className="p-4">
      <h3 className="text-lg font-semibold text-white truncate">{item.title}</h3>
      <p className="text-sm text-gray-300 mt-1">{item.type} - {item.color}</p>
      <Button onClick={() => onEdit(item)} className="mt-2 w-full">Edit</Button>
    </div>
  </motion.div>
);

const ItemGrid: React.FC<{ items: ClothingItem[]; onEdit: (item: ClothingItem) => void }> = ({ items, onEdit }) => (
  <motion.div layout className="flex flex-wrap justify-start">
    <AnimatePresence>
      {items.map((item) => (
        <ClothingItem key={item.id} item={item} onEdit={onEdit} />
      ))}
    </AnimatePresence>
  </motion.div>
);

const AddItemDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: Omit<ClothingItem, 'id'>) => void;
  editingItem: ClothingItem | null;
}> = ({ isOpen, onClose, onAdd, editingItem }) => {
  const [formData, setFormData] = useState<Omit<ClothingItem, 'id'>>({
    title: '',
    description: '',
    image: '',
    category: categories[0],
    type: types[0],
    color: colors[0],
    season: seasons[0],
  });

  useEffect(() => {
    if (editingItem) {
      setFormData(editingItem);
    } else {
      setFormData({
        title: '',
        description: '',
        image: '',
        category: categories[0],
        type: types[0],
        color: colors[0],
        season: seasons[0],
      });
    }
  }, [editingItem, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setFormData(prev => ({ ...prev, image: e.target?.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (formData.title && formData.description && formData.image) {
      onAdd(formData);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] pr-4">
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="image">Image</Label>
              <Input id="image" type="file" onChange={handleImageUpload} className="bg-gray-700" />
              {formData.image && <img src={formData.image} alt="Preview" className="w-full h-40 object-cover rounded-md mt-2" />}
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="bg-gray-700" />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="bg-gray-700" />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={handleSelectChange('category')}>
                <SelectTrigger id="category" className="bg-gray-700">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={handleSelectChange('type')}>
                <SelectTrigger id="type" className="bg-gray-700">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {types.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="color">Color</Label>
              <Select value={formData.color} onValueChange={handleSelectChange('color')}>
                <SelectTrigger id="color" className="bg-gray-700">
                  <SelectValue placeholder="Color" />
                </SelectTrigger>
                <SelectContent>
                  {colors.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="season">Season</Label>
              <Select value={formData.season} onValueChange={handleSelectChange('season')}>
                <SelectTrigger id="season" className="bg-gray-700">
                  <SelectValue placeholder="Season" />
                </SelectTrigger>
                <SelectContent>
                  {seasons.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </ScrollArea>
        <Button onClick={handleSubmit}>{editingItem ? 'Update' : 'Add'} Item</Button>
      </DialogContent>
    </Dialog>
  );
};

const ClusterFilter: React.FC<{ activeCluster: string; setActiveCluster: (cluster: string) => void }> = ({ activeCluster, setActiveCluster }) => (
  <div className="mb-6">
    <Label>Filter by:</Label>
    <div className="flex space-x-2 mt-2">
      {['All', 'Type', 'Color', 'Season'].map((cluster) => (
        <Button
          key={cluster}
          variant={activeCluster === cluster ? "default" : "outline"}
          onClick={() => setActiveCluster(cluster)}
          className="px-4 py-2 rounded-full"
        >
          {cluster}
        </Button>
      ))}
    </div>
  </div>
);

const DigitalCloset: React.FC = () => {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ClothingItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeCluster, setActiveCluster] = useState<string>('All');

  const handleAddItem = (newItem: Omit<ClothingItem, 'id'>) => {
    const itemWithId = { ...newItem, id: Date.now().toString() };
    setItems((prev) => [...prev, itemWithId]);
  };

  const handleEditItem = (item: ClothingItem) => {
    setEditingItem(item);
    setIsAddDialogOpen(true);
  };

  const filteredItems = items.filter((item) => 
    (activeCategory === 'All' || item.category === activeCategory) &&
    (activeCluster === 'All' || 
     (activeCluster === 'Type' && item.type === activeCluster) ||
     (activeCluster === 'Color' && item.color === activeCluster) ||
     (activeCluster === 'Season' && item.season === activeCluster))
  );

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">My Digital Closet</h1>
      <Button onClick={() => setIsAddDialogOpen(true)} className="mb-6">
        <Plus className="mr-2 h-4 w-4" /> Add New Item
      </Button>
      
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
        <TabsList>
          <TabsTrigger value="All">All</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <ClusterFilter activeCluster={activeCluster} setActiveCluster={setActiveCluster} />
      
      <ItemGrid items={filteredItems} onEdit={handleEditItem} />
      
      <AddItemDialog
        isOpen={isAddDialogOpen}
        onClose={() => {
          setIsAddDialogOpen(false);
          setEditingItem(null);
        }}
        onAdd={handleAddItem}
        editingItem={editingItem}
      />
    </div>
  );
};

export default DigitalCloset;