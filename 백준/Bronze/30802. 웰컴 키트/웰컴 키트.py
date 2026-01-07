N = int(input())
sizes = list(map(int, input().split()))
T, P = map(int, input().split())

shirt_bundle = 0
for size in sizes:
    if size == 0:
        continue
    elif size <= T:
        shirt_bundle += 1
    elif size % T == 0:
        shirt_bundle += (size // T)
    else :
        shirt_bundle += (size // T) + 1

pen_bundle = N//P
pen = N%P

print(shirt_bundle)
print(pen_bundle, pen)

# 티셔츠를 주문한다. 
# T장씩 묶음으로 주문해야 한다.

# 펜을 주문한다. 
# P자루 주문하고 남은 건 한 자루씩 주문해야 한다. 

# 총 인원 23
# 사이즈별로 3 1 4 1 5 9
# 티셔츠 묶음 5장씩 가능. 볼펜 묶음으로 7개씩 가능


