from rest_framework import serializers

from .models import User
from django.contrib.auth import authenticate


"""
In Django, a serializer is a module that allows you to convert complex data types, such as Django models, into Python data types that can be easily rendered into JSON or other content types. The "goal" of a serializer refers to its ability to handle the serialization process in an efficient and effective manner, with a focus on providing a clean, well-structured representation of the data.

Serializers in Django are typically used to interact with APIs and to serialize data for storage in a database or for other purposes. They provide a simple, flexible way to convert complex data into a format that can be easily processed by other systems, making it an essential tool for many applications.

In summary, the "goal" of a serializer in Django is its ability to handle data serialization in an efficient and effective way, providing clean and well-structured data representations for a variety of use cases.
"""

"""Serializers registration requests and creates a new user."""

def validate_password(password):
    if len(password) < 8:
        raise serializers.ValidationError("Password must be at least 8 characters long")
    if password.isdigit():
        raise serializers.ValidationError("Password must contain at least one letter")
    return password

class RegistrationSerializer(serializers.ModelSerializer):
        # Ensure passwords are at least 8 characters long, no longer than 128
    # characters, and can not be read by the client.
    password = serializers.CharField(
        max_length=128,
        min_length=8,
        # Don't send the password in the response
        write_only=True,
        validators=[validate_password]
    )

    # The client should not be able to send a token along with a registration
    # request. Making `token` read-only handles that for us.
    token = serializers.CharField(max_length=255, read_only=True)

    class Meta:
        model = User
        # List all of the fields that could possibly be included in a request
        # or response, including fields specified explicitly above.
        fields = ['email', 'username', 'password', 'token']
        validators = []

    def create(self, validated_data):
        # Use the `create_user` method we wrote earlier to create a new user.
        return User.objects.create_user(**validated_data)

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=255)
    password = serializers.CharField(max_length=128, write_only=True)
    token = serializers.CharField(max_length=255, read_only=True)

    def validate(self, data):

        # Client can send either username or email to log in
        username = data.get('username', None)
        if username is None:
            raise serializers.ValidationError(
                    'error : A username is required to log in.'
            )
        try:
            email = User.objects.get(username=username).email
        except:
            email = username
    
        password = data.get('password', None)
        if password is None:
            raise serializers.ValidationError(
                    'error :A password is required to log in.'
            )
        # Try to authenticate the user
        user = authenticate(email=email, password=password)

        if user is None:
            raise serializers.ValidationError('error : A user with this username/email and password is not found.')

        if not user.is_active:
            raise serializers.ValidationError('error : This user has been deactivated.')

        return {
            "email": user.email,
            "username": user.username,
            "token": user.token
        }
