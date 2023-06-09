from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from rest_framework.authtoken.models import Token
from .models import User, ChessGameStatistics, ChessGame
from django.contrib.auth import authenticate

"""
In Django, a serializer is a module that allows you to convert complex data types, such as Django models, into Python data types that can be easily rendered into JSON or other content types. The "goal" of a serializer refers to its ability to handle the serialization process in an efficient and effective manner, with a focus on providing a clean, well-structured representation of the data.

Serializers in Django are typically used to interact with APIs and to serialize data for storage in a database or for other purposes. They provide a simple, flexible way to convert complex data into a format that can be easily processed by other systems, making it an essential tool for many applications.

In summary, the "goal" of a serializer in Django is its ability to handle data serialization in an efficient and effective way, providing clean and well-structured data representations for a variety of use cases.
"""

"""Serializers registration requests and creates a new user."""

class RegistrationSerializer(serializers.ModelSerializer):

    email = serializers.EmailField(max_length=255, min_length=3, validators=[UniqueValidator(queryset=User.objects.all())], required=True)
    username = serializers.CharField(max_length=255, validators=[UniqueValidator(queryset=User.objects.all())], required=True)
    password = serializers.CharField(max_length=128, min_length=8, write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'country']

    def create(self, validated_data):
        # Use the `create_user` method we wrote earlier to create a new user.
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            country=validated_data['country']
        )
        user.save()

        # Create the chess statistics for the user 
        chess_stats = ChessGameStatistics.objects.create(user=user)
        chess_stats.save()

        return user
    
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=255)
    password = serializers.CharField(max_length=128, write_only=True)

    def validate(self, data):
        # Data is ordered dictionary

        # Client can send either username or email to log in
        username = data.get('username', None)
        print(username)
        if username is None:
            raise serializers.ValidationError(
                    'error : A username is required to log in.'
            )
        try:
            email = User.objects.get(username=username).email
        except:
            email = username

        password = data.get('password', None)
        print(password)
        if password is None:
            raise serializers.ValidationError(
                    'error :A password is required to log in.'
            )
        
        # Try to authenticate the user
        user = authenticate(username=username, password=password)

        if user is None:
            print('user is none')
            raise serializers.ValidationError('error : A user with this username/email and password is not found.')

        if not user.is_active:
            print('user is not active')
            raise serializers.ValidationError('error : This user has been deactivated.')

        print('user is valid')
        token, _ = Token.objects.get_or_create(user=user)
        return {
            "email": user.email,
            "username": user.username,
            "token": token.key,
            "country": user.country
        }

class ChessGameSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChessGame
        fields = '__all__'