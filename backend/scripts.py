import subprocess
import time

def run_makemigrations():
    # Define the command to run makemigrations
    command = ['python', 'manage.py', 'makemigrations']
    
    try:
        # Run the command as a subprocess and capture the output
        process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        # Start the timer
        start_time = time.time()
        
        # Wait for the process to complete and get the output
        while process.poll() is None:
            # Check if the timeout duration has exceeded
            if time.time() - start_time > 10:
                # Kill the process if it's still running
                process.terminate()
                process.wait()
                
                # Raise a timeout exception
                raise TimeoutError('makemigrations command timed out.')
            
            # Sleep for a short interval before checking again
            time.sleep(0.1)
        
        # Process has completed, get the output
        stdout, stderr = process.communicate()
        
        # Decode the output from bytes to string
        stdout_str = stdout.decode('utf-8')
        stderr_str = stderr.decode('utf-8')
        
        # Print the output
        print(stdout_str)
        
        # Check if there was an error
        if process.returncode != 0:
            print('Error occurred while running makemigrations:')
            print(stderr_str)
    
        # Return the output as a string
        return stdout_str
    
    except TimeoutError as e:
        print('Timeout occurred:', str(e))
        return ''
    
    except Exception as e:
        print('An error occurred:', str(e))
        return ''

def run_migrate():
    # Define the command to run makemigrations
    command = ['python', 'manage.py', 'migrate']
    
    try:
        # Run the command as a subprocess and capture the output
        process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        # Start the timer
        start_time = time.time()
        
        # Wait for the process to complete and get the output
        while process.poll() is None:
            # Check if the timeout duration has exceeded
            if time.time() - start_time > 10:
                # Kill the process if it's still running
                process.terminate()
                process.wait()
                
                # Raise a timeout exception
                raise TimeoutError('makemigrations command timed out.')
            
            # Sleep for a short interval before checking again
            time.sleep(0.1)
        
        # Process has completed, get the output
        stdout, stderr = process.communicate()
        
        # Decode the output from bytes to string
        stdout_str = stdout.decode('utf-8')
        stderr_str = stderr.decode('utf-8')
        
        # Print the output
        print(stdout_str)
        
        # Check if there was an error
        if process.returncode != 0:
            print('Error occurred while running makemigrations:')
            print(stderr_str)
    
        # Return the output as a string
        return stdout_str
    
    except TimeoutError as e:
        print('Timeout occurred:', str(e))
        return ''
    
    except Exception as e:
        print('An error occurred:', str(e))
        return ''

# Run the script
output = run_makemigrations()
output = run_migrate()
