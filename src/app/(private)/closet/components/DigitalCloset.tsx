"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Plus, Edit3, Trash, Info, Edit2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import closetServices from "@/services/closetServices";

interface ClothingItem {
  _id?: string;
  title: string;
  description: string;
  image: string;
  category: string;
  type: string;
  color: string;
  season: string;
}

const categories = ["Men", "Women", "Unisex", "Kids"];
const types = [
  "Shirt",
  "T-Shirt",
  "Pants",
  "Dress",
  "Skirt",
  "Jacket",
  "Shoes",
  "Accessory",
];
const colors = [
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Black",
  "White",
  "Gray",
  "Purple",
  "Pink",
  "Orange",
];
const seasons = ["Spring", "Summer", "Autumn", "Winter", "All-Season"];

const ClothingItem: React.FC<{
  item: ClothingItem;
  onEdit: (item: ClothingItem) => void;
  onDelete: (id: string) => void;
}> = ({ item, onEdit, onDelete }) => (
  <motion.div
    layout
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    whileHover={{ scale: 1.05 }}
    className="bg-gray-800 rounded-lg overflow-hidden shadow-lg m-2 w-48 relative group"
  >
    <img
      src={item.image}
      alt={item.title}
      className="w-full h-48 object-cover"
    />
    <div className="p-4">
      <h3 className="text-lg font-semibold text-white truncate">
        {item.title}
      </h3>
      <p className="text-sm text-gray-300 mt-1">
        {item.type} - {item.color}
      </p>
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center justify-between w-full space-x-2">
          <button
            onClick={() => onEdit(item)}
            className="p-2 rounded-full bg-white hover:bg-gray-100 text-black"
            title="Edit"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => {
              onDelete(item?._id || "");
            }}
            className="p-2 rounded-full bg-white hover:bg-gray-100 text-black"
            title="Delete"
          >
            <Trash size={16} />
          </button>
        </div>
      </div>
      {/* <p className="text-xs">Description: {item.description}</p> */}
      <button
        className="p-2 absolute top-1 right-1 rounded-full bg-gray-700 hover:bg-gray-800 text-white"
        title="Details"
      >
        <Info size={16} />
      </button>
    </div>
  </motion.div>
);

const ItemGrid: React.FC<{
  items: ClothingItem[];
  onEdit: (item: ClothingItem) => void;
  onDelete: (id: string) => void;
}> = ({ items, onEdit, onDelete }) => (
  <motion.div layout className="flex flex-wrap justify-start">
    <AnimatePresence>
      {items?.map((item) => (
        <ClothingItem
          key={item._id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </AnimatePresence>
  </motion.div>
);

const AddItemDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: Omit<ClothingItem, "id">) => void;
  editingItem: ClothingItem | null;
}> = ({ isOpen, onClose, onAdd, editingItem }) => {
  const [formData, setFormData] = useState<Omit<ClothingItem, "_id">>({
    title: "",
    description: "",
    image: "",
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
        title: "",
        description: "",
        image: "",
        category: categories[0],
        type: types[0],
        color: colors[0],
        season: seasons[0],
      });
    }
  }, [editingItem, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) =>
        setFormData((prev) => ({ ...prev, image: e.target?.result as string }));
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
      <DialogContent className="sm:max-w-[425px] max-h-[90%] bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>
            {editingItem ? "Edit Item" : "Add New Item"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh]  pr-4 pb-4">
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                type="file"
                onChange={handleImageUpload}
                className="bg-gray-700"
              />
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-md mt-2"
                />
              )}
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Title"
                className="bg-gray-700"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                className="bg-gray-700"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={handleSelectChange("category")}
              >
                <SelectTrigger id="category" className="bg-gray-700">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={handleSelectChange("type")}
              >
                <SelectTrigger id="type" className="bg-gray-700">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="color">Color</Label>
              <Select
                value={formData.color}
                onValueChange={handleSelectChange("color")}
              >
                <SelectTrigger id="color" className="bg-gray-700">
                  <SelectValue placeholder="Color" />
                </SelectTrigger>
                <SelectContent>
                  {colors.map((color) => (
                    <SelectItem key={color} value={color}>
                      {color}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="season">Season</Label>
              <Select
                value={formData.season}
                onValueChange={handleSelectChange("season")}
              >
                <SelectTrigger id="season" className="bg-gray-700">
                  <SelectValue placeholder="Season" />
                </SelectTrigger>
                <SelectContent>
                  {seasons.map((season) => (
                    <SelectItem key={season} value={season}>
                      {season}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="secondary" onClick={onClose} className="mr-2">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {editingItem ? "Update Item" : "Add Item"}
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export const ClothingItemsPage: React.FC = () => {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeCluster, setActiveCluster] = useState<string>("All");

  const fetchAllItems = async () => {
    const fetchedItems: any = await closetServices.fetchItems();
    console.log(fetchedItems, "????");
    setItems(fetchedItems?.data);
  };

  useEffect(() => {
    fetchAllItems();
  }, []);

  const handleEdit = (item: ClothingItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    console.log(id, ">>>");
    try {
      await closetServices.RemoveClosetById(id);
      await fetchAllItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleAddOrUpdate = async (item: Omit<ClothingItem, "id">) => {
    try {
      if (selectedItem) {
        await closetServices.EditCloset(selectedItem?._id, item);
      } else {
        await closetServices.AddCloset(item);
      }
      await fetchAllItems();
      setIsDialogOpen(false);
      setSelectedItem(null);
    } catch (error) {
      console.error("Error adding/updating item:", error);
    }
  };
  const filteredItems = items?.filter(
    (item) =>
      (activeCategory === "All" || item.category === activeCategory) &&
      (activeCluster === "All" ||
        (activeCluster === "Type" && item.type === activeCluster) ||
        (activeCluster === "Color" && item.color === activeCluster) ||
        (activeCluster === "Season" && item.season === activeCluster))
  );

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">My Digital Closet</h1>
      <Button onClick={() => setIsDialogOpen(true)} className="mb-6">
        <Plus className="mr-2 h-4 w-4" /> Add New Item
      </Button>
      <div className="flex  gap-4 items-end">
        <Tabs
          value={activeCategory}
          onValueChange={setActiveCategory}
          className="mb-6"
        >
          <TabsList className="bg-gray-900 border">
            <TabsTrigger value="All">All</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <ItemGrid
        items={filteredItems}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <AddItemDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onAdd={handleAddOrUpdate}
        editingItem={selectedItem}
      />
    </div>
  );
};

export default ClothingItemsPage;
