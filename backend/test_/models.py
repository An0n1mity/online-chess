from django.db import models
from django.contrib.auth.models import User, BaseUserManager, AbstractBaseUser, PermissionsMixin
from django.conf import settings
from django.utils.crypto import get_random_string

from datetime import datetime, timedelta
class UserManager(BaseUserManager):
    """
    Django requires that custom users define their own Manager class. By
    inheriting from `BaseUserManager`, we get a lot of the same code used by
    Django to create a `User`. 

    All we have to do is override the `create_user` function which we will use
    to create `User` objects.
    """

    def create_user(self, username, email, password=None, country=None):
        """Create and return a `User` with an email, username and password."""
        if username is None:
            raise TypeError('Users must have a username.')

        if email is None:
            raise TypeError('Users must have an email address.')
        
        user = self.model(username=username, email=self.normalize_email(email), country=country)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, username, email, password):
        """
        Create and return a `User` with superuser (admin) permissions.
        """
        if password is None:
            raise TypeError('Superusers must have a password.')

        user = self.create_user(username, email, password)
        user.is_superuser = True
        user.is_staff = True
        user.save()

        return user

import os
def get_image_upload_path(instance, filename):
    # Get the filename and extension
    _, ext = os.path.splitext(filename)
    # Generate a unique filename for the uploaded image
    unique_filename = f"{instance.pk}{ext}"
    # Return the upload path relative to the project directory
    return os.path.join("images", unique_filename)

class User(AbstractBaseUser, PermissionsMixin):
    # Each `User` needs a human-readable unique identifier that we can use to
    # represent the `User` in the UI. We want to index this column in the
    # database to improve lookup performance.
    username = models.CharField(db_index=True, max_length=255, unique=True)

    # We also need a way to contact the user and a way for the user to identify
    # themselves when logging in. Since we need an email address for contacting
    # the user anyways, we will also use the email for logging in because it is
    # the most common form of login credential at the time of writing.
    email = models.EmailField(db_index=True, unique=True)

    # Add the country field 
    country = models.CharField(max_length=255, blank=True, null=True)

    # Avatar
    avatar = models.ImageField(upload_to=get_image_upload_path, default="images/basic_avatar.png")

    # When a user no longer wishes to use our platform, they may try to delete
    # their account. That's a problem for us because the data we collect is
    # valuable to us and we don't want to delete it. We
    # will simply offer users a way to deactivate their account instead of
    # letting them delete it. That way they won't show up on the site anymore,
    # but we can still analyze the data.
    is_active = models.BooleanField(default=True)

    # The `is_staff` flag is expected by Django to determine who can and cannot
    # log into the Django admin site. For most users this flag will always be
    # false.
    is_staff = models.BooleanField(default=False)

    # A timestamp representing when this object was created.
    created_at = models.DateTimeField(auto_now_add=True)

    # A timestamp reprensenting when this object was last updated.
    updated_at = models.DateTimeField(auto_now=True)

    # More fields required by Django when specifying a custom user model.
    status = models.CharField(max_length=255, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='images/', default='images/basic_avatar.png')

    # The `USERNAME_FIELD` property tells us which field we will use to log in.
    # In this case we want it to be the email field.
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    # Tells Django that the UserManager class defined above should manage
    # objects of this type.
    objects = UserManager()

    def __str__(self):
        """
        Returns a string representation of this `User`.

        This string is used when a `User` is printed in the console.
        """
        return self.email

    @property
    def token(self):
        """
        Allows us to get a user's token by calling `user.token` instead of
        `user.generate_jwt_token().

        The `@property` decorator above makes this possible. `token` is called
        a "dynamic property".
        """
        return self._generate_jwt_token()

    def get_full_name(self):
        """
        This method is required by Django for things like handling emails.
        Typically this would be the user's first and last name. Since we do
        not store the user's real name, we return their username instead.
        """
        return self.username

    def get_short_name(self):
        """
        This method is required by Django for things like handling emails.
        Typically, this would be the user's first name. Since we do not store
        the user's real name, we return their username instead.
        """
        return self.username

    def _generate_jwt_token(self):
        """
        Generates a JSON Web Token that stores this user's ID and has an expiry
        date set to 60 days into the future.
        """
        dt = datetime.now() + timedelta(days=60)

        token = jwt.encode({
            'id': self.pk,
            'exp': int(dt.strftime('%s'))
        }, settings.SECRET_KEY, algorithm='HS256')

        return token

class ChessGameStatistics(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    games_played = models.IntegerField(default=0)
    games_won = models.IntegerField(default=0)
    games_lost = models.IntegerField(default=0)
    games_drawn = models.IntegerField(default=0)
    elo_rating = models.IntegerField(default=0)
    class Meta:
        verbose_name_plural = 'Chess game statistics'

class ChessGame(models.Model):
    id = models.CharField(max_length=10, primary_key=True, unique=True)
    player = models.ForeignKey(User, on_delete=models.CASCADE)
    bot_difficulty = models.IntegerField(default=1)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(blank=True, null=True)
    is_completed = models.BooleanField(default=False)
    # reason for game completion
    reason = models.CharField(max_length=100, blank=True, null=True)
    # player color
    color = models.CharField(max_length=1, default='w')
    # default fen string for the starting position
    state = models.CharField(max_length=100, default='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
    #time control
    time_control = models.CharField(max_length=10, default='None')
    # player elapsed time 
    player_remaining_time = models.DurationField(null=True, blank=True)
    # bot elasped time 
    bot_remaining_time = models.DurationField(null=True, blank=True)
    #last move time
    last_move_time = models.DateTimeField(null=True, blank=True)
    # is the player wined or lost 
    is_won = models.BooleanField(default=False)
    # number of moves
    moves = models.IntegerField(default=0)
    
    def save(self, *args, **kwargs):
        if not self.id:
            self.id = self._generate_unique_id()
        super().save(*args, **kwargs)

    def _generate_unique_id(self):
        length = 10
        unique_id = get_random_string(length)
        while ChessGame.objects.filter(id=unique_id).exists():
            unique_id = get_random_string(length)
        return unique_id

    
    