import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '@dietapp/api-client';
import { NutritionPlan, Meal, NutritionLog } from '@dietapp/shared-types';
import { theme } from '../theme';

export const NutritionScreen: React.FC = () => {
  const { user } = useAuth();
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan | null>(null);
  const [todayMeals, setTodayMeals] = useState<Meal[]>([]);
  const [nutritionLogs, setNutritionLogs] = useState<NutritionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMealModal, setShowMealModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [mealNotes, setMealNotes] = useState('');

  useEffect(() => {
    loadNutritionData();
  }, []);

  const loadNutritionData = async () => {
    try {
      setLoading(true);
      if (user?.id) {
        // Load nutrition plan
        const plan = await apiClient.nutrition.getNutritionPlan(user.id);
        setNutritionPlan(plan);

        // Load today's meals
        const meals = await apiClient.nutrition.getTodayMeals(user.id);
        setTodayMeals(meals);

        // Load nutrition logs
        const logs = await apiClient.nutrition.getNutritionLogs(user.id);
        setNutritionLogs(logs);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load nutrition data');
    } finally {
      setLoading(false);
    }
  };

  const logMeal = async (meal: Meal) => {
    if (!user?.id) return;

    try {
      await apiClient.nutrition.logMeal(user.id, {
        mealId: meal.id,
        consumedAt: new Date(),
        portionSize: 1,
        notes: mealNotes,
      });

      Alert.alert('Success', 'Meal logged successfully!');
      setShowMealModal(false);
      setSelectedMeal(null);
      setMealNotes('');
      loadNutritionData();
    } catch (error) {
      Alert.alert('Error', 'Failed to log meal');
    }
  };

  const openMealModal = (meal: Meal) => {
    setSelectedMeal(meal);
    setShowMealModal(true);
  };

  const calculateDailyTotals = () => {
    return nutritionLogs
      .filter(log => {
        const today = new Date().toDateString();
        return new Date(log.consumedAt).toDateString() === today;
      })
      .reduce(
        (totals, log) => ({
          calories: totals.calories + (log.meal?.calories || 0),
          protein: totals.protein + (log.meal?.protein || 0),
          carbs: totals.carbs + (log.meal?.carbs || 0),
          fat: totals.fat + (log.meal?.fat || 0),
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );
  };

  const dailyTotals = calculateDailyTotals();
  const targets = nutritionPlan?.dailyTargets || { calories: 2000, protein: 150, carbs: 250, fat: 65 };

  const renderMealItem = ({ item }: { item: Meal }) => (
    <TouchableOpacity
      style={styles.mealCard}
      onPress={() => openMealModal(item)}
    >
      <Text style={styles.mealName}>{item.name}</Text>
      <Text style={styles.mealDescription}>{item.description}</Text>
      <View style={styles.mealNutrition}>
        <Text style={styles.nutritionText}>{item.calories} cal</Text>
        <Text style={styles.nutritionText}>{item.protein}g protein</Text>
        <Text style={styles.nutritionText}>{item.carbs}g carbs</Text>
        <Text style={styles.nutritionText}>{item.fat}g fat</Text>
      </View>
    </TouchableOpacity>
  );

  const renderNutritionProgress = (label: string, current: number, target: number, unit: string) => {
    const percentage = Math.min((current / target) * 100, 100);
    
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>{label}</Text>
          <Text style={styles.progressText}>
            {current.toFixed(0)}/{target.toFixed(0)} {unit}
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${percentage}%` }]} />
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text>Loading nutrition data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nutrition</Text>
      
      <ScrollView style={styles.content}>
        {/* Daily Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Progress</Text>
          {renderNutritionProgress('Calories', dailyTotals.calories, targets.calories, 'cal')}
          {renderNutritionProgress('Protein', dailyTotals.protein, targets.protein, 'g')}
          {renderNutritionProgress('Carbs', dailyTotals.carbs, targets.carbs, 'g')}
          {renderNutritionProgress('Fat', dailyTotals.fat, targets.fat, 'g')}
        </View>

        {/* Today's Meals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Meals</Text>
          <FlatList
            data={todayMeals}
            renderItem={renderMealItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* Recent Logs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Meals</Text>
          {nutritionLogs.slice(0, 5).map((log) => (
            <View key={log.id} style={styles.logCard}>
              <Text style={styles.logMealName}>{log.meal?.name}</Text>
              <Text style={styles.logTime}>
                {new Date(log.consumedAt).toLocaleTimeString()}
              </Text>
              <Text style={styles.logNutrition}>
                {log.meal?.calories} cal • {log.meal?.protein}g protein
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Meal Modal */}
      <Modal
        visible={showMealModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMealModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedMeal?.name}</Text>
            <Text style={styles.modalDescription}>{selectedMeal?.description}</Text>
            
            <View style={styles.modalNutrition}>
              <Text style={styles.nutritionText}>{selectedMeal?.calories} calories</Text>
              <Text style={styles.nutritionText}>{selectedMeal?.protein}g protein</Text>
              <Text style={styles.nutritionText}>{selectedMeal?.carbs}g carbs</Text>
              <Text style={styles.nutritionText}>{selectedMeal?.fat}g fat</Text>
            </View>

            <TextInput
              style={styles.notesInput}
              placeholder="Add notes (optional)"
              value={mealNotes}
              onChangeText={setMealNotes}
              multiline
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowMealModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.logButton}
                onPress={() => selectedMeal && logMeal(selectedMeal)}
              >
                <Text style={styles.logButtonText}>Log Meal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    margin: theme.spacing.lg,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  progressContainer: {
    marginBottom: theme.spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  progressLabel: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '600',
  },
  progressText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
  mealCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mealName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  mealDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  mealNutrition: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  nutritionText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  logCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.success,
  },
  logMealName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  logTime: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  logNutrition: {
    fontSize: 12,
    color: theme.colors.primary,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  modalDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  modalNutrition: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    marginRight: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: theme.colors.text,
    fontWeight: '600',
  },
  logButton: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
  },
  logButtonText: {
    color: theme.colors.background,
    fontWeight: 'bold',
  },
});
