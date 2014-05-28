require 'pp'

result = []

STDIN.each_with_index do |line, idx|
  result << "[#{idx}] <#{line.chomp}>"
end

pp result
