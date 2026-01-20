/**
 * Écran du menu organisé par catégories
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  ActivityIndicator,
} from 'react-native';
import { productService, categoryService } from '../services/api';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category_id: number;
}

interface Category {
  id: number;
  name: string;
}

interface MenuSection {
  title: string;
  data: Product[];
}

export default function MenuScreen() {
  const [sections, setSections] = useState<MenuSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    try {
      const [categoriesRes, productsRes] = await Promise.all([
        categoryService.getAll(),
        productService.getAll(),
      ]);
      
      const categories: Category[] = categoriesRes.data.data;
      const products: Product[] = productsRes.data.data;
      
      // Grouper les produits par catégorie
      const menuSections = categories.map(category => ({
        title: category.name,
        data: products.filter(p => p.category_id === category.id),
      })).filter(section => section.data.length > 0);
      
      setSections(menuSections);
    } catch (error) {
      console.error('Erreur lors du chargement du menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>
      <Text style={styles.price}>{Number(item.price).toFixed(2)}€</Text>
    </View>
  );

  const renderSectionHeader = ({ section }: { section: MenuSection }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#38bdf8" />
        <Text style={styles.loadingText}>Chargement du menu...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        renderItem={renderProduct}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },

  loadingText: {
    marginTop: 12,
    color: '#000000',
    fontSize: 16,
  },

  list: {
    paddingBottom: 30,
  },

  /* SECTION */
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
  },

  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  /* CARD */
  card: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },

  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },

  description: {
    fontSize: 15,
    color: '#666666',
    lineHeight: 22,
    marginBottom: 12,
  },

  price: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
  },
});
