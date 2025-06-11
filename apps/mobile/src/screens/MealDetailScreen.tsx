import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { apiClient } from '@dietapp/api-client';
import { Meal } from '@dietapp/shared-types';
import { theme } from '../theme';

type MealDetailScreenProps = {
  mealId: string;
};

export const MealDetailScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { mealId } = route.params as MealDetailScreenProps;
  
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const [nutritionExpanded, setNutritionExpanded] = useState(false);

  useEffect(() => {
    loadMealDetails();
  }, [mealId]);

  const loadMealDetails = async () => {
    try {
      setLoading(true);
      const mealData = await apiClient.nutrition.getMeal(mealId);
      setMeal(mealData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load meal details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const logMeal = async () => {
    if (!meal) return;

    try {
      // In a real app, you'd get the user ID from auth context
      await apiClient.nutrition.logMeal('user-id', {
        mealId: meal.id,
        consumedAt: new Date(),
        portionSize: 1,
        notes: '',
      });

      Alert.alert(
        'Meal Logged!',
        'This meal has been added to your nutrition log.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to log meal');
    }
  };

  const renderNutritionInfo = () => {
    if (!meal) return null;

    const nutritionItems = [
      { label: 'Calories', value: meal.calories, unit: 'cal' },
      { label: 'Protein', value: meal.protein, unit: 'g' },
      { label: 'Carbohydrates', value: meal.carbs, unit: 'g' },
      { label: 'Fat', value: meal.fat, unit: 'g' },
      { label: 'Fiber', value: meal.fiber, unit: 'g' },
      { label: 'Sugar', value: meal.sugar, unit: 'g' },
      { label: 'Sodium', value: meal.sodium, unit: 'mg' },
    ];

    return (
      <View style={styles.nutritionContainer}>
        <TouchableOpacity
          style={styles.nutritionHeader}
          onPress={() => setNutritionExpanded(!nutritionExpanded)}
        >
          <Text style={styles.nutritionTitle}>Nutrition Information</Text>
          <Text style={styles.expandIcon}>
            {nutritionExpanded ? '−' : '+'}
          </Text>
        </TouchableOpacity>

        {nutritionExpanded && (
          <View style={styles.nutritionGrid}>
            {nutritionItems.map((item, index) => (
              <View key={index} style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>{item.label}</Text>
                <Text style={styles.nutritionValue}>
                  {item.value?.toFixed(1) || '0'} {item.unit}
                </Text>
              </View>
            ))}
          </View>
        )}

        {!nutritionExpanded && (
          <View style={styles.nutritionSummary}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{meal.calories}</Text>
              <Text style={styles.summaryLabel}>Calories</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{meal.protein}g</Text>
              <Text style={styles.summaryLabel}>Protein</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{meal.carbs}g</Text>
              <Text style={styles.summaryLabel}>Carbs</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{meal.fat}g</Text>
              <Text style={styles.summaryLabel}>Fat</Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderIngredients = () => {
    if (!meal?.ingredients || meal.ingredients.length === 0) {
      return null;
    }

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ingredients</Text>
        {meal.ingredients.map((ingredient, index) => (
          <View key={index} style={styles.ingredientItem}>
            <Text style={styles.ingredientName}>{ingredient.name}</Text>
            <Text style={styles.ingredientAmount}>
              {ingredient.amount} {ingredient.unit}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderInstructions = () => {
    if (!meal?.instructions || meal.instructions.length === 0) {
      return null;
    }

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Instructions</Text>
        {meal.instructions.map((instruction, index) => (
          <View key={index} style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>{index + 1}.</Text>
            <Text style={styles.instructionText}>{instruction}</Text>
          </View>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text>Loading meal details...</Text>
      </View>
    );
  }

  if (!meal) {
    return (
      <View style={styles.error}>
        <Text>Meal not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{meal.name}</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Meal Image */}
        {meal.imageUrl && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: meal.imageUrl }} style={styles.mealImage} />
          </View>
        )}

        {/* Meal Description */}
        <View style={styles.section}>
          <Text style={styles.description}>{meal.description}</Text>
          
          <View style={styles.mealMeta}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Prep Time</Text>
              <Text style={styles.metaValue}>{meal.prepTime || 'N/A'}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Cook Time</Text>
              <Text style={styles.metaValue}>{meal.cookTime || 'N/A'}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Servings</Text>
              <Text style={styles.metaValue}>{meal.servings || 1}</Text>
            </View>
          </View>
        </View>

        {/* Nutrition Information */}
        {renderNutritionInfo()}

        {/* Ingredients */}
        {renderIngredients()}

        {/* Instructions */}
        {renderInstructions()}

        {/* Tags */}
        {meal.tags && meal.tags.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagsContainer}>
              {meal.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Action Button */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.logButton} onPress={logMeal}>
          <Text style={styles.logButtonText}>Log This Meal</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    marginRight: theme.spacing.md,
  },
  backButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    flex: 1,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    height: 200,
    backgroundColor: theme.colors.border,
  },
  mealImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  section: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  description: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    marginBottom: theme.spacing.md,
  },
  mealMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  nutritionContainer: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  nutritionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  nutritionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  expandIcon: {
    fontSize: 20,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  nutritionSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  summaryLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  nutritionItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  nutritionLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  nutritionValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  ingredientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  ingredientName: {
    fontSize: 16,
    color: theme.colors.text,
    flex: 1,
  },
  ingredientAmount: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  instructionNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginRight: theme.spacing.sm,
    minWidth: 20,
  },
  instructionText: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 22,
    flex: 1,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  tag: {
    backgroundColor: theme.colors.primaryLight || theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  tagText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  actionContainer: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  logButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  logButtonText: {
    color: theme.colors.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
