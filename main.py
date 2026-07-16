
# 1 = Stone , 0 = paper , -1 = scissor 

import random 

PlayerScore = 0 
ComputerScore = 0 
play = "Y"

while play == "Y" :  

    computer = random.choice([-1,0,1]) 
    D = {"Stone" : 1 , "Paper" : 0,"Scissor" : -1}
    MyChoice = input("Enter your choice (Stone/Paper/Scissor): ").capitalize()

    if MyChoice not in D:
        print("Invalid Choice!")
        exit()
    
    choice = D[MyChoice]

    Reverse = {
        1: "Stone",
        0: "Paper",
        -1: "Scissor"
    }

    print(f"You chose {Reverse[choice]} \nComputer chose {Reverse[computer]}")

    if(computer == choice) :
        print("Draw!\nTry Again!")

    else:
        if(computer == 1 and choice == 0):
            print("You win!")
            PlayerScore +=1

        elif(computer == 1 and choice == -1):
            print("You lose!")
            ComputerScore +=1

        elif(computer == 0 and choice == -1):
            print("You win!")
            PlayerScore +=1

        elif(computer == 0 and choice == 1):
            print("You lose!")
            ComputerScore +=1
        
        elif(computer == -1 and choice == 0):
            print("You lose!")
            ComputerScore +=1

        elif(computer == -1 and choice == 1):
            print("You win!")
            PlayerScore +=1

        else :
            print("Something went wrong1")

    print("----------------")
    print("Scoreboard")
    print(f"You : {PlayerScore}")
    print(f"Computer : {ComputerScore}")
    print("----------------")       

    play = input("Play Again? (Y/N)").upper()

print("\nFinal Score")
print(f"You : {PlayerScore}")
print(f"Computer : {ComputerScore}")

if PlayerScore > ComputerScore:
    print("Overall Winner : You 🎉")

elif ComputerScore > PlayerScore:
    print("Overall Winner : Computer 🤖")

else:
    print("Overall Match Draw 🤝")
