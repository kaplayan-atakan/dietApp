import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
  Modal,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '@dietapp/api-client';
import { User, UserPreferences } from '@dietapp/shared-types';
import { theme } from '../theme';

export const ProfileScreen: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [userInfo, setUserInfo] = useState<Partial<User>>({});
  const [preferences, setPreferences] = useState<UserPreferences>({
    notifications: {
      workoutReminders: true,
      mealReminders: true,
      progressUpdates: true,
      achievements: true,
    },
    units: {
      weight: 'lbs',
      distance: 'miles',
      temperature: 'fahrenheit',
    },
    privacy: {
      profileVisible: true,
      shareProgress: false,
      allowFriendRequests: true,
    },
  });
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setUserInfo({
        name: user.name,
        email: user.email,
        age: user.age,
        height: user.height,
        weight: user.weight,
        fitnessLevel: user.fitnessLevel,
        goals: user.goals,
      });
      loadPreferences();
    }
  }, [user]);

  const loadPreferences = async () => {
    try {
      if (user?.id) {
        const userPrefs = await apiClient.users.getUserPreferences(user.id);
        setPreferences(userPrefs);
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  };

  const saveProfile = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const updatedUser = await apiClient.users.updateUser(user.id, userInfo);
      await apiClient.users.updateUserPreferences(user.id, preferences);
      
      updateUser(updatedUser);
      setEditMode(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
    }
    setShowLogoutModal(false);
  };

  const renderEditableField = (
    label: string,
    value: string | number | undefined,
    onChangeText: (text: string) => void,
    keyboardType: 'default' | 'numeric' | 'email-address' = 'default'
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {editMode ? (
        <TextInput
          style={styles.fieldInput}
          value={value?.toString() || ''}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
        />
      ) : (
        <Text style={styles.fieldValue}>{value || 'Not set'}</Text>
      )}
    </View>
  );

  const renderPreferenceSwitch = (
    label: string,
    value: boolean,
    onValueChange: (value: boolean) => void
  ) => (
    <View style={styles.preferenceRow}>
      <Text style={styles.preferenceLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
        thumbColor={theme.colors.background}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => editMode ? saveProfile() : setEditMode(true)}
          disabled={loading}
        >
          <Text style={styles.editButtonText}>
            {editMode ? (loading ? 'Saving...' : 'Save') : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          {renderEditableField(
            'Name',
            userInfo.name,
            (text) => setUserInfo({ ...userInfo, name: text })
          )}
          
          {renderEditableField(
            'Email',
            userInfo.email,
            (text) => setUserInfo({ ...userInfo, email: text }),
            'email-address'
          )}
          
          {renderEditableField(
            'Age',
            userInfo.age,
            (text) => setUserInfo({ ...userInfo, age: parseInt(text) || undefined }),
            'numeric'
          )}
          
          {renderEditableField(
            'Height (inches)',
            userInfo.height,
            (text) => setUserInfo({ ...userInfo, height: parseFloat(text) || undefined }),
            'numeric'
          )}
          
          {renderEditableField(
            'Weight (lbs)',
            userInfo.weight,
            (text) => setUserInfo({ ...userInfo, weight: parseFloat(text) || undefined }),
            'numeric'
          )}
        </View>

        {/* Fitness Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fitness Information</Text>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Fitness Level</Text>
            {editMode ? (
              <View style={styles.buttonGroup}>
                {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.levelButton,
                      userInfo.fitnessLevel === level && styles.selectedLevelButton
                    ]}
                    onPress={() => setUserInfo({ ...userInfo, fitnessLevel: level })}
                  >
                    <Text style={[
                      styles.levelButtonText,
                      userInfo.fitnessLevel === level && styles.selectedLevelButtonText
                    ]}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text style={styles.fieldValue}>
                {userInfo.fitnessLevel ? 
                  userInfo.fitnessLevel.charAt(0).toUpperCase() + userInfo.fitnessLevel.slice(1) : 
                  'Not set'
                }
              </Text>
            )}
          </View>
        </View>

        {/* Notification Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          {renderPreferenceSwitch(
            'Workout Reminders',
            preferences.notifications.workoutReminders,
            (value) => setPreferences({
              ...preferences,
              notifications: { ...preferences.notifications, workoutReminders: value }
            })
          )}
          
          {renderPreferenceSwitch(
            'Meal Reminders',
            preferences.notifications.mealReminders,
            (value) => setPreferences({
              ...preferences,
              notifications: { ...preferences.notifications, mealReminders: value }
            })
          )}
          
          {renderPreferenceSwitch(
            'Progress Updates',
            preferences.notifications.progressUpdates,
            (value) => setPreferences({
              ...preferences,
              notifications: { ...preferences.notifications, progressUpdates: value }
            })
          )}
          
          {renderPreferenceSwitch(
            'Achievement Notifications',
            preferences.notifications.achievements,
            (value) => setPreferences({
              ...preferences,
              notifications: { ...preferences.notifications, achievements: value }
            })
          )}
        </View>

        {/* Privacy Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          
          {renderPreferenceSwitch(
            'Profile Visible to Others',
            preferences.privacy.profileVisible,
            (value) => setPreferences({
              ...preferences,
              privacy: { ...preferences.privacy, profileVisible: value }
            })
          )}
          
          {renderPreferenceSwitch(
            'Share Progress with Friends',
            preferences.privacy.shareProgress,
            (value) => setPreferences({
              ...preferences,
              privacy: { ...preferences.privacy, shareProgress: value }
            })
          )}
          
          {renderPreferenceSwitch(
            'Allow Friend Requests',
            preferences.privacy.allowFriendRequests,
            (value) => setPreferences({
              ...preferences,
              privacy: { ...preferences.privacy, allowFriendRequests: value }
            })
          )}
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowLogoutModal(true)}
          >
            <Text style={styles.actionButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Logout</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to logout?
            </Text>
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <Text style={styles.logoutButtonText}>Logout</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  editButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  editButtonText: {
    color: theme.colors.background,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
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
  fieldContainer: {
    marginBottom: theme.spacing.md,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  fieldValue: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
  },
  fieldInput: {
    fontSize: 16,
    color: theme.colors.text,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  levelButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  selectedLevelButton: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  levelButtonText: {
    color: theme.colors.text,
    fontWeight: '600',
  },
  selectedLevelButtonText: {
    color: theme.colors.background,
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.sm,
  },
  preferenceLabel: {
    fontSize: 16,
    color: theme.colors.text,
    flex: 1,
  },
  actionButton: {
    backgroundColor: theme.colors.error,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  actionButtonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
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
  logoutButton: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.error,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: theme.colors.background,
    fontWeight: 'bold',
  },
});
