import Ember from 'ember';
const { inject } = Ember;

export default Ember.Controller.extend({

  flashMessages: inject.service(),

  actions: {
    registerUser() {
      const user = this.get('model');
      const flashMessages = this.get('flashMessages');
      user.save()
        .then(() => {
          flashMessages.success('User created');
          this.transitionTo('index');
        })
        .catch(error => {
          flashMessages.danger(error.responseJSON.message);
          console.error(JSON.stringify(error.responseJSON));
        });
    },
  },
});
