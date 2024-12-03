<template>
    <ion-modal :is-open="isOpen" @ionModalDidDismiss="handleClose">
      <ion-header>
        <ion-toolbar>
          <ion-title>{{ editingRace ? 'Edit Race' : 'Add New Race' }}</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="handleClose">Close</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
  
      <ion-content>
        <ion-list>
          <ion-item>
            <ion-label position="floating">Race Name</ion-label>
            <ion-input v-model="race.name" required></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">Description</ion-label>
            <ion-textarea v-model="race.description" rows="4" required></ion-textarea>
          </ion-item>
          <ion-item>
            <ion-label position="floating">Track Details</ion-label>
            <ion-input v-model="race.trackDetails" required></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">Scheduled Date</ion-label>
            <ion-datetime v-model="race.scheduledAt" display-format="YYYY-MM-DDTHH:mm" required></ion-datetime>
          </ion-item>
        </ion-list>
      </ion-content>
  
      <ion-footer>
        <ion-toolbar>
          <ion-buttons slot="end">
            <ion-button @click="handleSubmit">{{ editingRace ? 'Update Race' : 'Add Race' }}</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-footer>
    </ion-modal>
  </template>
  
  <script setup lang="ts">
  import { ref, defineProps, defineEmits, watch } from 'vue';
  import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonList, IonItem, IonLabel, IonInput, IonTextarea, IonDatetime, IonFooter } from '@ionic/vue';
  import { Race } from '@/utils/firestore'; // Sesuaikan dengan import Race dari firestore.ts
  import { firestoreService } from '@/utils/firestore'; // Import firestoreService untuk mengupdate atau menambah data balapan
  
  // Props untuk membuka modal dan mengedit data
  const props = defineProps<{
    isOpen: boolean;
    editingId: string | null;
    race: Omit<Race, 'id' | 'createdAt' | 'updatedAt'>;
  }>();
  
  // Emit untuk menutup modal
  const emit = defineEmits<{
    (e: 'update:isOpen', isOpen: boolean): void;
    (e: 'update:editingId', editingId: string | null): void;
    (e: 'submit'): void;
  }>();
  
  // State untuk mengontrol modal dan data race
  const isOpen = ref(props.isOpen);
  const race = ref({ ...props.race }); // Meng-copy objek race dari props
  
  // Watch props untuk reaktif terhadap perubahan dari parent
  watch(() => props.isOpen, (newValue) => {
    isOpen.value = newValue;
  });
  
  watch(() => props.race, (newValue) => {
    race.value = { ...newValue }; // Set ulang nilai race saat props.race berubah
  });
  
  // Menutup modal
  const handleClose = () => {
    emit('update:isOpen', false); // Memberitahu parent untuk menutup modal
    emit('update:editingId', null); // Reset editingId
  };
  
  // Fungsi untuk menangani submit (Add / Update race)
  const handleSubmit = async () => {
    // Validasi inputan
    if (!race.value.name || !race.value.description || !race.value.trackDetails || !race.value.scheduledAt) {
      alert('Please fill in all fields');
      return;
    }
  
    try {
      // Format tanggal menjadi objek Date sebelum disimpan
      const raceData = {
        ...race.value,
        scheduledAt: new Date(race.value.scheduledAt),
      };
  
      // Jika editingId ada, berarti sedang update
      if (props.editingId) {
        await firestoreService.updateRace(props.editingId, raceData); // Update race dengan id yang sudah ada
        alert('Race updated successfully');
      } else {
        await firestoreService.addRace(raceData); // Tambah race baru
        alert('Race added successfully');
      }
  
      emit('submit'); // Emit event submit ke parent
      handleClose(); // Tutup modal setelah submit
    } catch (error) {
      alert('Failed to save race');
      console.error(error);
    }
  };
  </script>
  
  <style scoped>
  /* Custom styles for the modal */
  ion-modal {
    --height: 70%;
    --min-height: 50%;
  }
  </style>
  